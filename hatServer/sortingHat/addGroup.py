from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

import json

##! Assuming json data comes in
def addGroup(data):
	name = data["name"]
	print("Adding " + name + " to database")
	paid = data["paid"]
	ip = data["ipPref"]
	##! Have to update the projectInformation.js
	option = data["option"]
	if option:
		opt_category = data["optionCategory"]
	skills = data["skills"]
	group_to_add = Groups(
		group_name=name,
		paid=paid,
		ip=ip,
		option=option,
		skills=skills
		)
	group_to_add.save()
	if option:
		group_to_add.update(opt_category=opt_category)
	group_to_add.reload()
