from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *
from hatServer.sortingHat.registerStudents import registerStudents
from hatServer.sortingHat.preprocessGroups import removeExtraGroups, unpopular
from hatServer.sortingHat.masterSort import sortThemStudents

import numpy
import random
import json

def averagePreference():
	prefs = []
	for g in Groups.objects:
		for student in g.members:
			index = student.preferences.index(g)
			prefs.append(index + 1)
	avg_pref = numpy.mean(prefs)
	# for student in Students.objects:
	# 	grp = student.group_assigned
	# 	index = student.preferences.index(grp)
	# 	##! + 1 since preferences aren't zero indexed
	# 	prefs.append(index + 1)
	# avg_pref = numpy.mean(prefs)
	return round(avg_pref, 2)

def avgFriendsPlaced(success_list):
	success = numpy.sum(success_list)
	val = success/163
	return round(val, 2)

def count(matched):
	c = 0
	for g in matched:
		for s in matched[g]:
			c += 1
	print(c) 

def numStudentsMatchedWith(student, group):
	success = 0
	if len(student.work_with) > 0:
		for s in student.work_with:
			if s in group.members:
				success += 1
	return success

def prefDistribution():
	distribution_json = {}
	one = 0
	two = 0
	three = 0
	four = 0
	five = 0
	for g in Groups.objects:
		for student in g.members:
			index = student.preferences.index(g) + 1
			if index == 1:
				one += 1
			if index == 2:
				two += 1
			if index == 3:
				three += 1
			if index == 4:
				four += 1
			if index == 5:
				five +=1
	distribution_json['first'] = str(one)
	distribution_json['second'] = str(two)
	distribution_json['third'] = str(three)
	distribution_json['fourth'] = str(four)
	distribution_json['fifth'] = str(five)

	return distribution_json
	# print("First preference: " + str(one))
	# print("Second preference: " + str(two))
	# print("Third preference: " + str(three))
	# print("Fourth preference: " + str(four))
	# print("Fifth preference: " + str(five))

def writeToDatabase(matched):
	for group in matched:
		for student in matched[group]:
			Groups.objects(
				group_name=group.group_name
				).update(
				add_to_set__members=student
				)
			Students.objects(
				identikey=student.identikey
				).update(
				group_assigned=group
				)
			group.reload()
			student.reload()

def writeResults():
	final_json_out = {}
	final_json_out['Groups'] = []
	for group in Groups.objects:
		group_json = {}
		group_json['group_name'] = group.group_name
		group_json['members'] = []
		# group_json['avg_gpa'] = 
		pref_list = []
		for student in group.members:
			pref = student.preferences.index(group) + 1
			pref_list.append(pref)
			student_json = {}
			student_json['student_name'] = student.student_name
			student_json['identikey'] = student.identikey
			student_json['group_assigned'] = student.group_assigned.group_name
			student_json['pref_acchieved'] = str(pref)
			student_json['friends_matched'] = str(numStudentsMatchedWith(student, group))
			group_json['members'].append(student_json)
		avg_pref = round(numpy.mean(pref_list), 2)
		group_json['avg_pref'] = str(avg_pref)
		final_json_out['Groups'].append(group_json)
	final_json_out['distribution'] = prefDistribution()
	final_json_out['overall_pref_avg'] = str(averagePreference())
	writeToJson(final_json_out)
		

def writeToJson(data):
	try:
		with open("./hatServer/static/js/config/results.json", 'w') as jsonFile:
			json.dump(data, jsonFile, indent=4)
	except:
		print("Run locally, so no resulsts.json file created")



def dumbledore():
	l_groups = []
	l_students = []
	for group in Groups.objects:
		Groups.objects(
			group_name=group.group_name
			).update(
			members=[], preferences=[]
			)
		group.reload()
	for student in Students.objects:
		Students.objects(
			identikey=student.identikey
			).update(
			group_assigned=None
			)
		student.reload()
	removeExtraGroups()
	registerStudents()
	ret_val = unpopular()
	if ret_val != 0:
		return ret_val
	for group in Groups.objects:
		l_groups.append(group)
	for student in Students.objects:
		l_students.append(student)
	matched = sortThemStudents(l_students, l_groups)
	writeToDatabase(matched)


	success_list = []
	for group in matched:
		s_list = []
		print(group.group_name + ":")
		for student in matched[group]:
			s_list.append(student)
		for student in matched[group]:
			success = 0
			if len(student.work_with) > 0:
				for s in student.work_with:
					if s in s_list:
						success += 1

			success_list.append(success)
			# out_string += (student.student_name + ","
			# 	+ group.group_name + ","
			# 	+ str(success) + "\n")
			print("\t" + student.student_name)

	print(averagePreference())
	print(avgFriendsPlaced(success_list))
	prefDistribution()
	count(matched)

	writeResults()

	# with open("results.csv", 'w') as fp:
	# 	fp.write(out_string)

	return matched

def main(args):
	connect('sortingHat')
	# ret_val, matched = dumbledore()
	matched = dumbledore()
	if matched:
		return 0
	return 1

if __name__ == '__main__':
	import sys
	sys.exit(main(sys.argv))
