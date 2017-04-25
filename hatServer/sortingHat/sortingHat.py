from mongoengine import *
from enum import Enum
import csv
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

import numpy
import random
import json

##! This function combines all variables, but unused in current implementation
##! May be more applicable to a hungarian algorithm approad
def calcStudentPreference(known, learn, preference):
    # weight variables. This should be more extensible to account
    # for multiple possible variables
    assert (known >= 0)
    assert (learn >= 0)
    assert (preference > 0)
    pref = 5 * 1/preference + LEARN_WEIGHT * learn + \
            KNOWN_WEIGHT * known
    return pref

##! Use this to make list a group preferences for gale-shapley
def calcGroupPreference(known, learn, ip_score):
    assert (known >= 0)
    assert (learn >= 0)
    assert (ip_score >= -1)
    pref = LEARN_WEIGHT * learn + KNOWN_WEIGHT * known \
            + IP_WEIGHT * ip_score
#    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
    return pref

def addStudent(data):
    print("Adding student " + data["identikey"])
    name = data["firstName"] + data["lastName"]
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
    student_to_add = Students(
        student_name=name,
        identikey=identikey,
        known_skills=known_skills,
        learn_skills=learn_skills,
        leadership=leadership,
        ip_pref=ip_pref
    )
    student_to_add.save()
    
    if "requestedPartners" in data:
        work_with = data["requestedPartners"]
        for name in work_with:
            student_to_add.update(add_to_set__temp_work_with=name)
    if "bannedPartners" in data:
        dont_work_with = data["bannedPartners"]
        for name in dont_work_with:
            student_to_add.update(add_to_set__temp_dont_work_with=name)
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
    #registerUser(student_to_add)
##! This function registers students with each connected group and adds the
##! student to the group's preference list with the associated preference score
def registerUser(student, groups):
    known_score = 0
    learn_score = 0
    ip_score = 0
    for grp in student.preferences:
        grp_name = grp.group_name
        index = 0
        for group in groups:
            if group.group_name == grp_name:
                break
            else:
                index += 1
        # How to weight group preferences for students?
        for attr in groups[index].skills:
            if attr in student.known_skills and known_score < MAX_SKILL_LEN:
                known_score += 1 
            if attr in student.learn_skills and learn_score < MAX_SKILL_LEN:
                learn_score += 1
        if student.ip_pref == 'NO_PREF':
            ##! No pref, no score
            ip_score = 0
        elif student.ip_pref == 'RETAIN' and groups[index].ip == 'OPEN':
            ip_score = 2
        else: # student.ip_pref == 'RETAIN' and groups[index].ip == 'CLOSED'
            ip_score = -1
        pref = calcGroupPreference(known_score, learn_score, ip_score)
        groups[index].preferences[student] = pref
        for db_group in Groups.objects:
            if db_group.group_name == groups[index].group_name:
                db_group.preferences[student.identikey] = pref
                db_group.save()
"""
def registerUser(student):
    known_score = 0
    learn_score = 0
    ip_score = 0
    for grp in student.preferences:
        for attr in grp.skills:
            if attr in student.known_skills and known_score < MAX_SKILL_LEN:
                known_score += 1
            if attr in student.learn_skills and learn_score < MAX_SKILL_LEN:
                learn_score += 1
        if student.ip_pref == 'NO_PREF':
            ip_score = 0
        elif student.ip_pref == 'RETAIN' and grp.ip == 'OPEN':
            ip_score = 2
        elif student.ip_pref == 'RETAIN' and grp.ip == 'CLOSED':
            ip_score = -1
        pref = calcGroupPreference(known_score, learn_score, ip_score)
        #grp.preferences[student.identikey] = pref
        pref_doc = Preference(student=student, pref_score=pref)
        db_group = Groups.objects.get(group_name=grp.group_name)
        print("adding pref scores to " + db_group.group_name)
        db_group.update(add_to_set__preferences=pref_doc)
        db_group.save()
"""

def trimGroups(students, groups):
    g_count = int(float(len(students))/OPT_SIZE)
    min_edges = 10000 
    while len(groups) > g_count:
        for group in groups:
            if len(group.preferences) < min_edges:
                group_to_drop = group
        print("Removing %s" % group)
        groups.remove(group)
    for student in students: 
        if group in student.preferences:
            student.preferences.remove(group)

def unpopular(groups):
    for group in groups:
        if len(group.preferences) < MIN_SIZE:
            if group.paid:
                print("WARNING: Noone likes a paid group")
            print(group.group_name + " is unpopular")

def partnerUpBitches(student, group):
    if len(student.work_with) > 0:
        group.preferences[student] += GROUP_WEIGHT
        for s in student.work_with:
            if s in group.preferences:
                ##! Here we modify the preference score for students
                ##! who want to work with each other.
                ##! TODO what's the best way to apply this change?
                group.preferences[s] += GROUP_WEIGHT
    return sorted(group.preferences,
                  key=group.preferences.__getitem__,
                  reverse=True)

def nopeBitches(student, group):
    if len(student.dont_work_with) > 0:
        for s in student.dont_work_with:
            if s in group.preferences:
                group.preferences[s] -= GROUP_WEIGHT
                ##! This value probably shouldn't go negative since
                ##! it might do unexpected stuff later on, so if it's
                ##! negative, just set it to zero
                if group.preferences[s] < 0:
                    group.preferences[s] = 0
    return sorted(group.preferences,
                  key=group.preferences.__getitem__,
                  reverse=True)

def modPrefsForBitches(groups):
    for group in groups:
        if group.paid:
            pref_list = []
            for s in group.preferences:
                index = 1
                for g in s.preferences:
                    if g.group_name == group.group_name:
                        pref_list.append(index)
                        break
                    else:
                        index += 1
            avg = numpy.mean(pref_list)
            if SUBVERT_FOR_PAY:
                if avg >= MIN_PAID_AVG_PREF_SCORE:
                    for s in group.preferences:
                        s.preferences.remove(group)
                        s.preferences = [group] + s.preferences

def payForBitches(groups):
    paid_dict = {}
    for group in groups:
        if group.paid and len(group.preferences) < MIN_SIZE:
            print("MATCHING FAILED: paid group was not chosen enough")
            return None
        if group.paid and len(group.preferences) <= OPT_SIZE:
            ##! We'll return the list of students in this paid group, assign
            ##! them to the group and remove them from the free pool
            print(group.group_name + " is being filled first with:")
            for s in group.preferences:
                print("\t" + s.student_name)
                val.append(s)
            paid_dict[group] = val
    ##! TODO What if there's more than one paid group?
    return paid_dict

def swapThemBitches(shortGroup, firstPass, groups):
    print("Fixing " + shortGroup.group_name)
    for group in groups:
        if group == shortGroup:
            continue
        if len(group.members) > OPT_SIZE:
            for student in group.members:
                if len(shortGroup.members) >= MIN_SIZE:
                    return
                if shortGroup in student.preferences:
                    group.members.remove(student)
                    shortGroup.members.append(student)
                    if len(group.members) == OPT_SIZE:
                        break
                if len(group.members) == 0:
                    break
        elif not firstPass and len(group.members) > MIN_SIZE:
            #TODO add guard against overdrawing from group to below min_size
            for student in group.members:
                if len(group.members) == MIN_SIZE:
                    return
                if len(shortGroup.members) >= MIN_SIZE:
                    return
                if shortGroup in student.preferences:
                    group.members.remove(student)
                    shortGroup.members.append(student)

##! This is an implementation of the Gale/Shapley algorithm. It's modeled off
##! of this code: https://rosettacode.org/wiki/Stable_marriage_problem#Python
def sortThemBitches(students, groups):
    students_free = students[:]
    matched = {}
    student_prefers = {}
    group_prefers = {}
    modPrefsForBitches(groups)
    for student in students:
#        pref_list = sorted(student.preferences,
#                           key=student.preferences.__getitem__,
#                           reverse=True)
        student_prefers[student] = student.preferences

    for group in groups:
        pref_list = sorted(group.preferences,
                           key=group.preferences.__getitem__,
                           reverse=True)
        group_prefers[group] = pref_list

    ##! First step is to ensure lightly chosen paid groups are filled
    paid_dict = payForBitches(groups)
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
            return matched
        g_ref = s_list.pop(0)
        g_name = g_ref.group_name
        index = 0
        g = None
        for group in groups:
            if group.group_name == g_name:
                g = group
        
        match = matched.get(g)
        if not match:
            # group has no matches yet
            matched[g] = [s]
            if s.leadership != "STRONG_FOLLOW":
                g.has_leader = True
            if s.leadership == "STRONG_LEAD":
                g.has_strong_leader = True
            group_prefers[g] = partnerUpBitches(s, g)
            group_prefers[g] = nopeBitches(s, g)

        elif len(match) <= OPT_SIZE:
            #Open space in group
                if g.has_strong_leader and s.leadership == "STRONG_LEAD" and\
                LEADERSHIP_MATTERS and len(s_list) > 1:
                    print(s.student_name + "not allowed in" + g.group_name)
                    students_free.append(s)
                else:
                    matched[g].append(s)
                    if s.leadership != "STRONG_FOLLOW":
                        g.has_leader = True
                    if s.leadership == "STRONG_LEAD":
                        g.has_strong_leader = True
                    group_prefers[g] = partnerUpBitches(s, g)
                    group_prefers[g] = nopeBitches(s, g)

        else:
            g_list = group_prefers[g]
            replaced = False
            for m in match:
                if g_list.index(m) > g_list.index(s):
                    #replace less preferred student with current student
                    if g.has_strong_leader and s.leadership == "STRONG_LEAD" and\
                    LEADERSHIP_MATTERS and len(s_list) > 1:
                        print(s.student_name + "not allowed in" + g.group_name)
                        break
                    else:
                        matched[g].remove(m)
                        matched[g].append(s)
                        if s.leadership != "STRONG_FOLLOW":
                            g.has_leader = True
                        if s.leadership == "STRONG_LEAD":
                            g.has_strong_leader = True
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
                        group_prefers[g] = nopeBitches(s, g)
                        break
            if not replaced:
                if s_list:
                    students_free.append(s)
                else:
                    if len(match) < MAX_SIZE:
                        matched[g].append(s)

    for group in matched:
        leader_present = False
        if not group.has_leader:
            print("WARNING: no leader in this group")
        for student in matched[group]:
            if student.leadership == "STRONG_LEAD" and not leader_present:
                leader_present = True
            elif student.leadership == "STRONG_LEAD" and leader_present:
                print("WARNING: too many cooks in the kitchen")
            group.members.append(student)
    for group in matched:
        if len(group.members) < MIN_SIZE:
            swapThemBitches(group, True, groups)
            if len(group.members) < MIN_SIZE:
                swapThemBitches(group, False, groups)
    for group in matched:
        matched[group] = group.members
        for student in group.members:
            student.group_assigned = group

    for group in groups:
        if group.paid and len(group.members) < MIN_SIZE:
            print("MATCHING FAILED: paid group was unfilled")

    return matched

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
    return avg_pref

def updateDb(l_students, l_groups):
    for l_student in l_students:
        s_to_update = Students.objects.get(identikey=l_student.identikey)
        s_to_update.update(
            group_assigned=l_student.group_assigned,
        )
    for l_group in l_groups:
        g_to_update = Groups.objects.get(group_name=l_group.group_name)
        g_to_update.update(
            has_leader=l_group.has_leader,
            has_strong_leader=l_group.has_strong_leader,
        )
        for s in l_group.members:
            g_to_update.update(add_to_set__members=s)
        g_to_update.save()

# This function is a controller, basically it abstracts all the stuff that
# was in main. This way we can import this function when we want to call
# the sorting stuff from the server
##! This version of dumbledore creates a local copy of the db collections
##! and operates on them, but it makes updating the db cumbersome
def dumbledore():
    matched = None
    l_students = []
    l_groups = []
    for group in Groups.objects:
        group.modify(members=[], preferences={})
        l_groups.append(group)
    for student in Students.objects:
        registerUser(student, l_groups)
#        registerUser(student)
        l_students.append(student)
#    for group in Groups.objects:
#        group.modify(members=[], preferences={})
#        l_groups.append(group)
    unpopular(l_groups)
    matched = sortThemBitches(l_students, l_groups)
    updateDb(l_students, l_groups)
    """
    for l_student in l_students:
        s_to_update = Students.objects.get(identikey=l_student.identikey)
        s_to_update.modify(group_assigned=l_student.group_assigned)
        s_to_update.save()
    for student in Students.objects:
        for l_student in l_students:
            if student.identikey == l_student.identikey:
                student.modify(group_assigned=l_student.group_assigned)
                student.save()
                break
    for group in Groups.objects:
        for l_group in l_groups:
            if group.group_name == l_group.group_name:
                for student in l_group.members:
                    group.update(add_to_set__members=student)
                group.save
                break
    for l_group in l_groups:
        g_to_update = Groups.objects.get(group_name=l_group.group_name)
        for s in l_group.members:
            g_to_update.update(add_to_set__members=s)
        g_to_update.save()
    """
    if matched:
        for group in l_groups:
#           print(group._id)
            value = group.members
            print(group.group_name + ":")
            for student in value:
                print("\t{student.student_name}".format(student=student))
#               student.save()
        avg_pref = averagePreference(matched)
        print(avg_pref)
    return matched
"""
def dumbledore():
    students = Students.objects.all()
    groups = Groups.objects.all()
    for student in students:
        registerUser(student, groups)
    unpopular(groups)
    sortThemBitches(students, groups)
    for group in groups:
        group.save()
        value = group.members
        print(group.group_name + ":")
        for student in value:
            print("\t{student.student_name}".format(student=student))
            student.save()
"""
##! You know what this is
def main(args):
    connect()
    dumbledore()

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
