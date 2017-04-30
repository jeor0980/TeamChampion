from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
import numpy
import json

from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

##! This function first calculates the average preference score
##! for a paid group. 'Preference score' meaning the average ranking
##! that students chose for it when selecting groups.
##! If the calculated average preference score is less than the 
##! defined minimum (see variables.json), we call the modPrefs
##! function.
##! INPUT:	students - local array of all student documents in db
##!			CONST groups - local array of group documents CONST
##!
##! OUTPUT:	students - the modified students array returned by mod
def calcPaidGroupPrefAvg(students, groups):
	for group in groups:
		if group.paid:
			pref_list = []
			for pref in group.preferences:
				index = 1
				for g in pref.student.preferences:
					if g.group_name == group.group_name:
						pref_list.append(index)
						break
					else:
						index += 1
			avg = numpy.mean(pref_list)
			if SUBVERT_FOR_PAY:
				if avg >= MIN_PAID_AVG_PREF_SCORE:
					students = modPrefsForBitches(students, group, avg)
	return students

##! This function changes the order of a student's preferences
##! if dictated by calcPaidGroupPrefAvg.
##!
##! INPUT:	students - local array of students
##!			CONST group - the paid group which will be shifted in students'
##!					preference lists
##!	OUTPUT:	students - the modified students array	
def modPrefsForBitches(students, group, avg):
	print("WARNING: Promoting " + group.group_name + 
		" with an average score of " + str(avg))
	for pref in group.preferences:
		for s in students:
			if s.identikey == pref.student.identikey:
				s.preferences.remove(group)
				s.preferences = [group] + s.preferences
				break
	return students

##! This function prefills paid group that were not chosen by only
##! the minimum number of students. If a group was chosen by less
##! than the minimum number of students, the algorithm will exit
##! and log the appropriate error.
##!
##! INPUT:	matched - the dictionary containing groups and their members
##!					should be empty when this is called
##!			students - array of free students
##!			CONST groups - local array of groups CONST
##! OUTPUT:	int - This return value dictates how the program will exit if
##!				if the matching fails
##!			matched - updated matched dictionary
##!			students - updated array of free students
def payForBitches(matched, students, groups):
	for group in groups:
		if group.paid and len(group.preferences) < MIN_SIZE:
			print("MATCHING FAILED: paid group " + group.group_name + 
				"  was not chosen enough")
			return 1, None, None
		if group.paid and len(group.preferences) < MAX_SIZE:
			##! We'll return the list of students in this paid group, assign
			##! them to the group and remove them from the free pool
			print(group.group_name + " is being filled first with:")
			matched[group] = []
			for pref in group.preferences:
				print("\t" + pref.student.student_name)
				matched[group].append(pref.student)
				students.remove(pref.student)
	##! TODO What if there's more than one paid group?
	return 0, matched, students

##! Increase the preference score for people requested by a student
##! just sorted into the group
##! TODO Instead of doing this as each student is added for all other
##! students yet to be added, check for existing students in the group, 
##! than increment
##!
##! INPUT:	student - the student we just added
##!			group - the group we just added to
##! OUTPUT:	function - casts the single group to a list and
##!						and passes it into the function we use
##!						to order lists of preference documents
def partnerUpBitches(student, group, group_prefers):
	if len(student.work_with) > 0:
		for pref in group.preferences:
			if pref.student == student:
				group_prefers = incGroupPref(student, group)
				continue
			if pref.student in student.work_with:
				group_prefers = incGroupPref(pref.student, group)
	return group_prefers

##! Basically, do the opposite of partnerUp, we'll decrement pref
##! score for people who someone just added to a group doesn't want
##! to work with.
##!
##! INPUT:	student - the student we just added
##!			group - the group we just added to
##! OUTPUT:	function - build an ordered list
##! TODO This might be causing the poorer performance
def nopeBitches(student, group, group_prefers, matched):
	if len(student.dont_work_with) > 0:
		for s in student.dont_work_with:
			if s in matched[group]:
				matched[group].remove(s)
				for pref in group.preferences:
					if pref.s == s:
						# This favors people already grouped over their 'enemies'
						pref.pref_score -= ENEMY_WEIGHT
						group_prefers = extractOrderFromPrefs(group)
	return group_prefers, matched

##! Check if we're trying to add a student to a group that has an enemy
##! of if the student to be added is on any existing group members' enemy
##! lists
def checkForNopes(student, group, matched):
	for s in matched[group]:
		if (s in student.dont_work_with) or (student in s.dont_work_with):
			return True
	return False

##! This compares the indices of a student to be added with the students
##! already in a group and determines which student will stay in the group
##! TWO STUDENTS ENTER, ONE STUDENT LEAVES
##!
##! INPUT:	student - duh
##! 		group - you've figured this out by now
##!			group_prefers - ordered list of group preferences
##!			matched - dictionary
##!			students - array of free students
##! OUTPUT:	matched - updated dictionary
##!			students - updated list of free students
def compareNopes(student, group, group_prefers, matched, students):
	# If there's more than one student already in the group who either is
	# disliked by the student being added, or is disliked by that student, 
	# we just won't let the student trying to get in, in.
	count = 0
	for s in matched[group]:
		if (s in student.dont_work_with) or (student in s.dont_work_with):
			count += 1
	if count > 1:
		students.append(student)
		return matched, students
	else:
		for s in matched[group]:
			if (s in student.dont_work_with) or (student in s.dont_work_with):
				# ordered list, so lower index is more preferred
				if group_prefers.index(student) < group_prefers.index(s):
					return s
				else:
					students.append(student)
					return None

##! Similar thing to compareNopes, but for leadership instead of banned
##!
##! INPUTs and OUTPUT are the same
def compareLeaders(student, group, group_prefers, matched, students):
	for s in matched[group]:
		if s.leadership == "STRONG_LEAD":
			if group_prefers.index(student) < group_prefers.index(s):
				return s
			else:
				students.append(student)
				return None

##! Replaces one student with another in the matched dictionary
##!
##! INPUT:	s_incoming - the student to be put into the group
##!			s_outgoing - the student to be replaced
##!			group - the group we're replacing in
##!			group_preferes - ordered list of preferences
##!			matched - dictionary
##!			students - list of free students
##! OUTPUT:	changed objects
def replaceStudent(s_incoming, s_outgoing, group, group_prefers, matched, students):
	# print("Replacing " + s_outgoing.student_name + " with " + s_incoming.student_name)
	index = matched[group].index(s_outgoing)
	matched[group].remove(s_outgoing)
	matched[group].append(s_incoming)
	# Instead, we let replaced student drop out and start over
	# students.append(s_outgoing)
	group_prefers = partnerUpBitches(s_incoming, group, group_prefers)
	group_prefers, matched = nopeBitches(s_incoming, group, group_prefers, matched)
	return group_prefers, matched, students

##! Helper function to read in json data from file
##!
##! INPUT:	None
##! OUTPUT:	json object
def getJsonFromFile():
	with open("id_map.json") as json_file:
		json_data = json.load(json_file)
		return json_data

##! Checks to see if there are students in the db that have not been
##! sorted. Pulls identikeys from a json file that's built when the
##! algorithm starts
##!
##! INPUT:	matched - dictionary
##! OUTPUT:	list - list of student identikeys that were not sorted
def checkComplete(matched):
	matched_ids = []
	unsorted = []
	all_ids = []
	data = getJsonFromFile()
	for name in data:
		all_ids.append(data[name])
	for group in matched:
		for student in matched[group]:
			matched_ids.append(student.identikey)
	unsorted = set(all_ids) - set(matched_ids)
	return list(unsorted)

##! Swaps students from full groups into groups that are underfilled
##!
##! INPUT:	shortGroup - the small group
##!			firstPass - bool that determines the size threshold of the
##!						group to pull from
##!			matched - dictionary
##! OUTPUT:	matched - updated dictionary
def swapThemBitches(shortGroup, firstPass, matched):
	print("Fixing " + shortGroup.group_name)
	for group in matched:
		if group == shortGroup:
			continue
		if len(matched[group]) > OPT_SIZE:
			for student in matched[group]:
				if len(matched[shortGroup]) >= MIN_SIZE:
					return matched
				if (shortGroup in student.preferences) and not leadershipCheck(student, shortGroup, matched) and not checkForNopes(student, shortGroup, matched):
					matched[group].remove(student)
					matched[shortGroup].append(student)
					# shortGroup.members.append(student)
					if len(matched[shortGroup]) >= MIN_SIZE:
						return matched
					if len(matched[group]) == OPT_SIZE:
						break
				if len(matched[group]) == 0:
					break
		elif not firstPass and len(matched[group]) > MIN_SIZE:
			#TODO add guard against overdrawing from group to below min_size
			for student in matched[group]:
				if len(matched[group]) == MIN_SIZE:
					break
				if len(matched[shortGroup]) >= MIN_SIZE:
					return matched
				if (shortGroup in student.preferences) and not leadershipCheck(student, shortGroup, matched) and not checkForNopes(student, shortGroup, matched):
					matched[group].remove(student)
					matched[shortGroup].append(student)
					# shortGroup.members.append(student)
					if len(matched[shortGroup]) >= MIN_SIZE:
						return matched
					if len(matched[group]) == OPT_SIZE:
						break
				if len(matched[group]) == 0:
					break
	return matched

##! Handles the calls to swapThemBitches
##!
##! INPUT:	matched - dictionary
##!			group_prefers - also a dictionary
##! OUTPUT:	matched - updated dictionary
def swapController(matched, group_prefers):
	for group in matched:
		if len(matched[group]) < MIN_SIZE:
			matched = swapThemBitches(group, True, matched)
			if len(matched[group]) < MIN_SIZE:
				matched = swapThemBitches(group, False, matched)
	return matched

##! Checks if we're trying to put a student who is a strong leader
##! into a group that already has a strong leader
##!
##! INPUT:	student - the student we're trying to add
##!			group - the group we're trying to add to
##!			matched - dictionary of existing matches
##! OUTPUT:	bool - True if there is a conflict
def leadershipCheck(student, group, matched):
	if student.leadership == "STRONG_LEAD" and LEADERSHIP_MATTERS:
		for s in matched[group]:
			if s.leadership == "STRONG_LEAD":
				return True
	return False

##! Little function that pulls the student and associated score
##! out of the list of Preference embedded documents in each Group
##! object, sorts them by preference score then sticks that list into
##! into a dictionary which is returned
##!
##! INPUT:	groups - the local array of groups UNCHANGED
##! OUTPUT:	ret_val - list of ordered students
def extractOrderFromPrefs(group):
	ret_val = []
	temp_dict = {}
	for pref in group.preferences:
		temp_dict[pref.student] = pref.pref_score
	ret_val = sorted(temp_dict,
					key=temp_dict.__getitem__,
					reverse=True)
	return ret_val

##! Confusing function that checks a student to be added against potential
##! leadership or banned student conflicts. Swaps the students if the student
##! that's trying to be added is a better match.
##!
##! INPUT:	all the stuff
##! OUTPUT: the changed stuff
def attemptPlacement(student, group, group_prefers, matched, students):
	nope = checkForNopes(student, group, matched)
	lead = leadershipCheck(student, group, matched)
	if nope:
		# This handles the assignment
		nope_to_replace = compareNopes(
			student, 
			group, 
			group_prefers, 
			matched, 
			students
			)
		if nope_to_replace in matched[group]:
			if lead:
				leader_to_replace = compareLeaders(
					student,
					group,
					group_prefers,
					matched,
					students
					)
				if leader_to_replace:
					group_prefers, matched, students = replaceStudent(
						student,
						nope_to_replace,
						group,
						group_prefers,
						matched,
						students
						)
					if leader_to_replace != nope_to_replace:
						matched[group].remove(leader_to_replace)

			else:
				group_prefers, matched, students = replaceStudent(
					student,
					nope_to_replace,
					group,
					group_prefers,
					matched,
					students
					)

	elif lead:
		leader_to_replace = compareLeaders(
			student,
			group,
			group_prefers,
			matched,
			students
			)
		if leader_to_replace:
			group_prefers, matched, students = replaceStudent(
				student,
				leader_to_replace,
				group,
				group_prefers,
				matched,
				students
				)
	return group_prefers, matched, students

def incGroupPref(student, group):
	for pref in group.preferences:
		if pref.student == student:
			# TODO make this a variable
			pref.pref_score += GROUP_WEIGHT
			return extractOrderFromPrefs(group)

##! This is an implementation of the Gale/Shapley algorithm. It's modeled off
##! of this code: https://rosettacode.org/wiki/Stable_marriage_problem#Python
def sortThemBitches_new(students, groups):
	fall_through = False
	# Don't actually create the local free list yet...
	students_free = []
	matched = {}
	student_prefers = {}
	master_student_prefers = {}
	group_prefers = {}
	students = calcPaidGroupPrefAvg(students, groups)
	# Now we can make the free list with the potentially modified
	# students array
	students_free = students[:]
	# for student in students_free:
	# 	student.second_pass = False
	# Build the student_prefers dictionary, easy mode
	for student in students:
		student_prefers[student] = list(student.preferences)
	# Build group_prefers was hard mode, so outsource it
	for group in groups:
		group_prefers[group] = extractOrderFromPrefs(group)

	##! First step is to ensure lightly chosen paid groups are filled
	ret, matched, students_free = payForBitches(matched, 
									students_free, groups)
	if ret != 0:
		# Return format for this function is: int(return value), {matched}
		return None

	while students_free:
		s = students_free.pop(0)
		s_list = student_prefers[s]
		if len(s_list) < 1:
			continue
		g = student_prefers[s].pop(0)

		match = matched.get(g)
		if not match:
			# group has no matches yet
			# print(g.group_name + " has no matches yet.")
			# Don't have to check leadership, since FIRST!
			# TODO log first entry
			matched[g] = [s]
			group_prefers[g] = partnerUpBitches(s, g, group_prefers[g])
			group_prefers[g], matched = nopeBitches(s, g, group_prefers[g], matched)

		elif len(match) < OPT_SIZE:
			#Open space in group
			# print(g.group_name + " is being filled")
			if leadershipCheck(s, g, matched) or checkForNopes(s, g, matched):
				if ATTEMPT_REPLACE:
					group_prefers[g], matched, students_free = attemptPlacement(
						s,
						g,
						group_prefers[g],
						matched,
						students_free
						)
				else:
					students_free.append(s)

			else:
				matched[g].append(s)
				group_prefers[g] = partnerUpBitches(s, g, group_prefers[g])
				group_prefers[g], matched = nopeBitches(s, g, group_prefers[g], matched)

		##! Be more lenient on group size for second pass students
		elif len(match) < MAX_SIZE and fall_through:
			#Open space in group
			# print(g.group_name + " is being filled even more")
			if leadershipCheck(s, g, matched) or checkForNopes(s, g, matched):
				if ATTEMPT_REPLACE:
					group_prefers[g], matched, students_free = attemptPlacement(
						s,
						g,
						group_prefers[g],
						matched,
						students_free
						)
				else:
					students_free.append(s)
			# if leadershipCheck(s, g, matched):
			# 	student_free.append(s)
			else:
				matched[g].append(s)
				group_prefers[g] = partnerUpBitches(s, g, group_prefers[g])
				group_prefers[g], matched = nopeBitches(s, g, group_prefers[g], matched)			

		else:
			# print(g.group_name + " is competitive.")
			if leadershipCheck(s, g, matched) or checkForNopes(s, g, matched):
				if ATTEMPT_REPLACE:
					group_prefers[g], matched, students_free = attemptPlacement(
						s,
						g,
						group_prefers[g],
						matched,
						students_free
						)
				else:
					students_free.append(s)
			else:
				g_list = group_prefers[g]
				for m in match:
					for pref in g.preferences:
						if pref.student == m:
							cur_pref = pref.pref_score
						elif pref.student == s:
							new_pref = pref.pref_score
					# if g_list.index(m) > g_list.index(s):
					if cur_pref < new_pref:
					#replace less preferred student with current student
						# print("Replacing " + m.student_name + " with " + s.student_name)
						group_prefers[g], matched, students_free = replaceStudent(
							s, 
							m,
							g, 
							g_list, 
							matched, 
							students_free
							)
						if len(student_prefers[m]) > 0:
							students_free.append(m)
						else:
							if len(match) < MAX_SIZE:
								matched[g].append(m)
						break
				else:
					if len(s_list) > 0:
						students_free.append(s)
					else:
						if len(match) < MAX_SIZE:
							matched[g].append(s)

		if len(students_free) < 1:
			unsorted = checkComplete(matched)
			if len(unsorted) > 0:
				for student in students:
					if student.identikey in unsorted:
						student_prefers[student] = list(student.preferences)
						students_free.append(student)
						for group in student.preferences:
							group_prefers[group] = incGroupPref(student, group)
				fall_through = True

	##! TODO this should be separate, single responsibility principle and all

	matched = swapController(matched, group_prefers)

	return matched