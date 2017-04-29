from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *
from hatServer.sortingHat.registerStudents import registerStudents
from hatServer.sortingHat.preprocessGroups import removeExtraGroups, unpopular
from hatServer.sortingHat.masterSort import sortThemBitches
from hatServer.sortingHat.masterSort_alternate import sortThemBitches_new

import numpy
import random
import json

def averagePreference(matched):
	prefs = []
	for g in matched:
		for student in matched[g]:
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

def prefDistribution(matched):
	one = 0
	two = 0
	three = 0
	four = 0
	five = 0
	for g in matched:
		for student in matched[g]:
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
	print("First preference: " + str(one))
	print("Second preference: " + str(two))
	print("Third preference: " + str(three))
	print("Fourth preference: " + str(four))
	print("Fifth preference: " + str(five))




def alt_dum():
	l_groups = []
	l_students = []
	removeExtraGroups()
	registerStudents()
	ret_val = unpopular()
	if ret_val != 0:
		return ret_val
	for group in Groups.objects:
		l_groups.append(group)
	for student in Students.objects:
		l_students.append(student)
	matched = sortThemBitches_new(l_students, l_groups)

	out_string = ""
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
			out_string += (student.student_name + ","
				+ group.group_name + ","
				+ str(success) + "\n")
			print("\t" + student.student_name)

	print(averagePreference(matched))
	print(avgFriendsPlaced(success_list))
	prefDistribution(matched)
	count(matched)

	with open("results.csv", 'w') as fp:
		fp.write(out_string)

	return matched

def dumbledore():
	matched = None
	removeExtraGroups()
	for group in Groups.objects:
		group.modify(members=[], preferences=[])
#    for student in Students.objects:
#        registerUser(student, l_groups)
#        l_students.append(student)

	registerStudents()
	ret_val = unpopular()
	if ret_val != 0:
		return ret_val
	ret_val, matched = sortThemBitches()
#    updateDb(l_students, l_groups)
	if ret_val != 0:
		return ret_val

##! This is all stuff to format for different outputs
##! Trying to make some of the analytics easier
	out_string = ""
	success_list = []
	for group in Groups.objects:
		s_list = []
		print(group.group_name + ":")
		for student in group.members:
			s_list.append(student)
		for student in group.members:
			if student.group_assigned != group:
				print(student.student_name + " thinks they're in " +
					student.group_assigned.group_name + " but they're in " +
					group.group_name)
			else:
				success = 0
				if len(student.work_with) > 0:
					for s in student.work_with:
						if s in s_list:
							success += 1
					success_list.append(success)
				out_string += (student.student_name + ","
					+ group.group_name + ","
					+ str(success) + "\n")
				print("\t" + student.student_name)

	with open("results.csv", 'w') as fp:
		fp.write(out_string)
# 	if matched:
# 		for group in matched:
# 			value = group.members
# 			print(group.group_name + ":")
# 			for student in value:
# 				print("\t{student.student_name}".format(student=student))
# #               student.save()
	print(averagePreference(matched))
	print(avgFriendsPlaced(success_list))
	prefDistribution(matched)
	count(matched)

	return ret_val, matched

def main(args):
	connect('sortingHat')
	# ret_val, matched = dumbledore()
	alt_dum()
	return ret_val

if __name__ == '__main__':
	import sys
	sys.exit(main(sys.argv))