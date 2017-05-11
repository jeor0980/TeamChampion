from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

import json

def addStudent(data):
    print("Adding student " + data["identikey"])
    name = data["firstName"] + " " + data["lastName"]
    identikey = data["identikey"]
    first_name = data["firstChoice"]
    second_name = data["secondChoice"]
    third_name = data["thirdChoice"]
    fourth_name = data["fourthChoice"]
    fifth_name = data["fifthChoice"]
    known_skills = data["skills"]
    learn_skills = data["desired"]
    ip_pref = data["ipPref"]
    leadership = data["lead"]
    if "extraCredit" in data:
        extra_credit = data["extraCredit"]
    student_to_add = Students(
        student_name=name,
        identikey=identikey,
        known_skills=known_skills,
        learn_skills=learn_skills,
        extra_credit=extra_credit,
        leadership=leadership,
        ip_pref=ip_pref
    )
    student_to_add.save()
    if "requestedPartners" in data:
        work_with = data["requestedPartners"]
        for name in work_with:
            # ident = convertNameToId(name)
            student_to_add.update(add_to_set__temp_work_with=name)
#           student_to_add.update(add_to_set__temp_work_with=name)
    if "bannedPartners" in data:
        dont_work_with = data["bannedPartners"]
        for name in dont_work_with:
            # ident = convertNameToId(name)
            student_to_add.update(add_to_set__temp_dont_work_with=name)
#            student_to_add.update(add_to_set__temp_dont_work_with=name)
    student_to_add.save()
    first_pref = Groups.objects.get(group_name=first_name)
    student_to_add.update(add_to_set__preferences=first_pref)

    second_pref = Groups.objects.get(group_name=second_name)
    student_to_add.update(add_to_set__preferences=second_pref)
    third_pref = Groups.objects.get(group_name=third_name)
    student_to_add.update(add_to_set__preferences=third_pref)
    fourth_pref = Groups.objects.get(group_name=fourth_name)
    student_to_add.update(add_to_set__preferences=fourth_pref)
    fifth_pref = Groups.objects.get(group_name=fifth_name)
    student_to_add.update(add_to_set__preferences=fifth_pref)
    student_to_add.save()
