from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
import numpy

from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

def removeExtraGroups():
	print("REMOVING EXTRA GROUPS")
	opt_groups = []
	opt_dict = {}
	for group in Groups.objects:
		if group.option:
			opt_groups.append(group)
	for group in opt_groups:
		if group.opt_category in opt_dict:
			opt_dict[group.opt_category].append(group)
		else:
			opt_dict[group.opt_category] = [group]
	for cat in opt_dict:
		del_list = []
		max_pref = 100 # Just needs to be greater than 5
		chosen_group = None
		for group in opt_dict[cat]:
			avg = avgPref(group)
			if avg < max_pref:
				max_pref = avg
				if chosen_group:
					del_list.append(chosen_group)
					chosen_group = None
				chosen_group = group
			else:
				del_list.append(group)
		for group in del_list:
			print("WARNING: Removing group" + group.group_name)
			Groups.objects(group_name=group.group_name).delete()
			for student in Students.objects:
				if group in student.preferences:
					##! We have a couple options here, we can replace removed
					##! groups with the chosen group, or just delete the groups
					##! TODO Add variable flag to select either replacing or deleting
					##! TODO add logic to replace
					Students.objects(
						identikey=student.identikey
						).update(pull__preferences=group)
					student.reload()

def avgPref(group):
	prefs = []
	for student in Students.objects:
		if group in student.preferences:
			index = student.preferences.index(group)
			prefs.append(index + 1)
	avg_prefs = numpy.mean(prefs)
	return avg_prefs

##! Additional cull step after registration

def removeGroup(group):
	print("WARNING: Removing group: " + group.group_name)
	Groups.objects(group_name=group.group_name).delete()
	for student in Students.objects:
		if group in student.preferences:
			student.update(pull__preferences=group)

def unpopular():
	for group in Groups.objects:
		if len(group.preferences) < MIN_SIZE:
			if group.paid:
				print("WARNING: Noone likes paid group " + group.group_name)
				return 1
			print(group.group_name + " is unpopular")
			removeGroup(group)
	return 0
    