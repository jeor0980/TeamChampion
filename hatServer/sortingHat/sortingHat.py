from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *
from hatServer.sortingHat.registerStudents import registerStudents
from hatServer.sortingHat.preprocessGroups import removeExtraGroups, unpopular
from hatServer.sortingHat.masterSort import sortThemBitches

import numpy
import random
import json

def averagePreference(matched):
	prefs = []
#    for g in matched:
#        for s in matched[g]:
#            index = 5 - len(s.preferences)
#            prefs.append(index)
#    avg_pref = numpy.mean(prefs)
	for student in Students.objects:
		grp = student.group_assigned
		index = student.preferences.index(grp)
		##! + 1 since preferences aren't zero indexed
		prefs.append(index + 1)
	avg_pref = numpy.mean(prefs)
	return round(avg_pref, 2)

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
	if matched:
		for group in matched:
			value = group.members
			print(group.group_name + ":")
			for student in value:
				print("\t{student.student_name}".format(student=student))
#               student.save()
		avg_pref = averagePreference(matched)
		print(avg_pref)

	return ret_val, matched

def main(args):
	connect('sortingHat')
	ret_val, matched = dumbledore()
	return ret_val

if __name__ == '__main__':
	import sys
	sys.exit(main(sys.argv))