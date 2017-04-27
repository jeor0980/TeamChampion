from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
import numpy
import json

from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

def modPrefsForBitches():
	for group in Groups.objects:
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
					for pref in group.preferences:
						s = Students.objects.get(
							identikey=pref.student.identikey,
							)
						s.update(pull__preferences=group)
						old_list = s.preferences
						new_list = [group] + old_list
						s.update(pull_all__preferences=old_list)
						s.update(add_to_set__preferences=new_list)

def payForBitches():
	paid_dict = {}
	for group in Groups.objects:
		if group.paid and len(group.preferences) < MIN_SIZE:
			print("MATCHING FAILED: paid group " + group.group_name + 
				"  was not chosen enough")
			return 1, None
		if group.paid and len(group.preferences) <= OPT_SIZE:
			##! We'll return the list of students in this paid group, assign
			##! them to the group and remove them from the free pool
			print(group.group_name + " is being filled first with:")
			for pref in group.preferences:
				print("\t" + pref.student.student_name)
				val.append(pref.student)
			paid_dict[group] = val
	##! TODO What if there's more than one paid group?
	return 0, paid_dict

def partnerUpBitches(student, group):
	if len(student.work_with) > 0:
		# group.update(inc__preferences__S__pref_score=GROUP_WEIGHT)
		Groups.objects(
			group_name=group.group_name, 
			preferences__student=student
			).update(
			inc__preferences__S__pref_score=GROUP_WEIGHT
			)
		group.reload()
		# s_to_update = group(preferences__student=student)
		# new_score = s_to_update.pref_score + GROUP_WEIGHT
		# s_to_update.update(pref_score=new_score)
		for s in student.work_with:
			Groups.objects(
				group_name=group.group_name,
				preferences__student=s
				).update(
				inc__preferences__S__pref_score=GROUP_WEIGHT
				)
			group.reload()
	return group.preferences

def nopeBitches(student, group, matched):
	removed_students = []
	if len(student.dont_work_with) > 0:
		for s in student.dont_work_with:
			if s in matched[group]:
				matched[group].remove(s)
				print("Removing " + s.student_name + " from group " + group.group_name)	
			Groups.objects(
				group_name=group.group_name,
				preferences__student=s
				).update(
				dec__preferences__S__pref_score=GROUP_WEIGHT
				)
			group.reload()		
	return group.preferences, matched

def getJsonFromFile():
	with open("id_map.json") as json_file:
		json_data = json.load(json_file)
		return json_data

def convertNameToIdJson(name):
	data = getJsonFromFile()
	if name in data:
		return data[name]
	else:
		print("You made a typo in the data file")
		return None

def checkComplete(matched):
	all_ids = []
	matched_ids = []
	unsorted = []
	data = getJsonFromFile()
	for name in data:
		all_ids.append(data[name])
	for group in matched:
		for student in matched[group]:
			matched_ids.append(student.identikey)
	unsorted = set(all_ids) - set(matched_ids)
	return list(unsorted)

def swapThemBitches(shortGroup, firstPass):
	print("Fixing " + shortGroup.group_name)
	for group in Groups.objects:
		if group == shortGroup:
			continue
		if len(group.members) > OPT_SIZE:
			for student in group.members:
				if len(shortGroup.members) >= MIN_SIZE:
					return
				if (shortGroup in student.preferences
					and not checkLeader(student, shortGroup)):
					Groups.objects(
						group_name=group.group_name
						).update(pull__members=student)
					group.reload()
					# group.members.remove(student)
					Groups.objects(
						group_name=shortGroup.group_name
						).update(add_to_set__members=student)
					shortGroup.reload()
					# shortGroup.members.append(student)
					if len(group.members) == OPT_SIZE:
						break
				if len(group.members) == 0:
					break
		elif not firstPass and len(group.members) > MIN_SIZE:
			#TODO add guard against overdrawing from group to below min_size
			for student in group.members:
				if len(group.members) == MIN_SIZE:
					break
				if len(shortGroup.members) >= MIN_SIZE:
					return
				if (shortGroup in student.preferences
					and not checkLeader(student, shortGroup)):
					Groups.objects(
						group_name=group.group_name
						).update(pull__members=student)
					group.reload()
					# group.members.remove(student)
					Groups.objects(
						group_name=shortGroup.group_name
						).update(add_to_set__members=student)
					shortGroup.reload()

def swapController(matched):
	for group in matched:
		if len(group.members) < MIN_SIZE:
			swapThemBitches(group, True)
			if len(group.members) < MIN_SIZE:
				swapThemBitches(group, False)

def warnLeaders(matched):
	for group in matched:
		leader_present = False
		if not group.has_leader:
			print("WARNING: no leader in group " + group.group_name)
		for student in matched[group]:
			if student.leadership == "STRONG_LEAD" and not leader_present:
				leader_present = True
			elif student.leadership == "STRONG_LEAD" and leader_present:
				print("WARNING: too many cooks in the kitchen for group " + 
					group.group_name)
				print("Try running the algorithm once more without modifying the database. This may resolve the duplicate leader issue.")

def checkLeader(student, group):
	if (group.has_strong_leader 
		and student.leadership == "STRONG_LEAD" 
		and LEADERSHIP_MATTERS):
			print(s.student_name + " is not allowed in " + g.group_name)
			return True
	return False

##! This is an implementation of the Gale/Shapley algorithm. It's modeled off
##! of this code: https://rosettacode.org/wiki/Stable_marriage_problem#Python
def sortThemBitches():
	fall_through = False
	students_free = []
	for student in Students.objects:
		students_free.append(student)
	matched = {}
	student_prefers = {}
	group_prefers = {}
	modPrefsForBitches()
	for student in Students.objects:
		student_prefers[student] = student.preferences

	for group in Groups.objects:
		# pref_list = []
		# for pref in group.preferences:
		# 	pref_list.append(pref)
		group_prefers[group] = group.preferences

	##! First step is to ensure lightly chosen paid groups are filled
	ret, paid_dict = payForBitches()
	if ret != 0:
		return ret
	if paid_dict:
		for g in paid_dict:
			for s in paid_dict[g]:
				matched[g].append(s)
				students_free.remove(s)

	while students_free:
		s = students_free.pop(0)
		s_list = student_prefers[s]
		if len(s_list) < 1:
			print(s.student_name + " is out of options")
			return 1, matched
		g = s_list.pop(0)
		# g_name = g_ref.group_name
		# index = 0
		# g = None
		# for group in groups:
		#     if group.group_name == g_name:
		#         g = group

		match = matched.get(g)
		if not match:
			# group has no matches yet
			# print(g.group_name + " has no matches yet.")
			matched[g] = [s]
			if s.leadership != "STRONG_FOLLOW":
				Groups.objects(
					group_name=g.group_name
					).update(has_leader=True)
				g.reload()
				s.reload()
			if s.leadership == "STRONG_LEAD":
				Groups.objects(
					group_name=g.group_name
					).update(has_strong_leader=True)
				g.reload()
				s.reload()
				print("Strong lead set: " + str(g.has_strong_leader))
			group_prefers[g] = partnerUpBitches(s, g)
			group_prefers[g], matched = nopeBitches(s, g, matched)

		elif len(match) < OPT_SIZE and not fall_through:
			#Open space in group
			# print(g.group_name + " is being filled")
			if checkLeader(s, g):
				students_free.append(s)
			else:
				matched[g].append(s)
				if s.leadership != "STRONG_FOLLOW":
					Groups.objects(
						group_name=g.group_name
						).update(has_leader=True)
					g.reload()
					s.reload()
				if s.leadership == "STRONG_LEAD":
					Groups.objects(
						group_name=g.group_name
						).update(has_strong_leader=True)
					g.reload()
					s.reload()
					print("Strong lead set: " + str(g.has_strong_leader))
				group_prefers[g] = partnerUpBitches(s, g)
				group_prefers[g], matched = nopeBitches(s, g, matched)
		##! Be more lenient on group size for second pass students
		elif len(match) < MAX_SIZE and fall_through:
			#Open space in group
			# print(g.group_name + " is being filled even more")
			if checkLeader(s, g):
				students_free.append(s)
			else:
				matched[g].append(s)
				if s.leadership != "STRONG_FOLLOW":
					Groups.objects(
						group_name=g.group_name
						).update(has_leader=True)
					g.reload()
					s.reload()
				if s.leadership == "STRONG_LEAD":
					Groups.objects(
						group_name=g.group_name
						).update(has_strong_leader=True)
					g.reload()
					s.reload()
					print("Strong lead set: " + str(g.has_strong_leader))
				group_prefers[g] = partnerUpBitches(s, g)
				group_prefers[g], matched = nopeBitches(s, g, matched)

		else:
			# print(g.group_name + " is competitive.")
			g_list = group_prefers[g]
			replaced = False
			for m in match:
				for pref in g_list:
					if pref.student == m:
						cur_pref = pref.pref_score
					elif pref.student == s:
						new_pref = pref.pref_score
				if cur_pref < new_pref:
					#replace less preferred student with current student
					print("Replacing " + m.student_name + " with " + s.student_name)
					if (checkLeader(s, g) 
						and not (m.leadership == "STRONG_LEAD")):
						continue
					else:
						matched[g].remove(m)
						matched[g].append(s)
						if s.leadership != "STRONG_FOLLOW":
							Groups.objects(
								group_name=g.group_name
								).update(has_leader=True)
							g.reload()
							s.reload()
						if s.leadership == "STRONG_LEAD":
							Groups.objects(
								group_name=g.group_name
								).update(has_strong_leader=True)
							g.reload()
							s.reload()
							print("Strong lead set: " + str(g.has_strong_leader))
						if len(student_prefers[m]) > 0:
							students_free.append(m)
						else:
							#No op, but this will break things, so here's one
							#solution, but:
							#TODO: make this work better
							if len(match) < MAX_SIZE:
								matched[g].append(m)
						replaced = True
						group_prefers[g] = partnerUpBitches(s, g)
						group_prefers[g], matched = nopeBitches(s, g, matched)
						break
			if not replaced:
				if len(s_list) > 0:
					students_free.append(s)
				else:
					if len(match) < MAX_SIZE:
						matched[g].append(s)

		if len(students_free) < 1:
			unsorted = checkComplete(matched)
			if len(unsorted) > 0:
				for identikey in unsorted:
					student = Students.objects.get(identikey=identikey)
					for group in student.preferences:
						for pref in group.preferences:
							Groups.objects(
								group_name=group.group_name
								).update(
								pull__preferences__student=student
								)
							score = pref.pref_score + GROUP_WEIGHT
							np = Preference(student=student, pref_score=score)
							Groups.objects(
								group_name=group.group_name
								).update(add_to_set__preferences=np)
							group.reload()
							group_prefers[group] = group.preferences
					students_free.append(student)
					student_prefers[student] = student.preferences
					print(student.student_name + " is being re-sorted.")
				fall_through = True

	for group in matched:
		for student in matched[group]:
			Groups.objects(
				group_name=group.group_name
				).update(
				add_to_set__members=student
				)
			group.reload()
			# group.members.append(student)
	swapController(matched)
	warnLeaders(matched)
	for group in Groups.objects:
		if group.paid and len(group.members) < MIN_SIZE:
			print("MATCHING FAILED: paid group was unfilled: " + 
				group.group_name)
			return 1, matched
	for group in Groups.objects:
		matched[group] = group.members
		for student in group.members:
			Students.objects.get(
				identikey=student.identikey
				).update(group_assigned=group)
			student.reload()

	return 0, matched