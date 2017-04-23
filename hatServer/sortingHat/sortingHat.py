from mongoengine import *
from enum import Enum
import csv
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students
from hatServer.sortingHat.variables import *

import numpy
import random

"""
Global variables here, not great but it works for now. Next step would be to
populate these through form input so that the instructor can change these as
we've planned. The skills list should also be handled differently at some
point, probably something else the instructor should populate.
"""
"""
MAX_SKILL_LEN = 10
LEARN_WEIGHT = 0.2
KNOWN_WEIGHT = 0.1
GROUP_WEIGHT = 5.0
MIN_SIZE = 4
MAX_SIZE = 6
OPT_SIZE = 5
"""

class Lead(Enum):
    NO_PREF = 0
    STRONG_LEAD = 1
    PREFER_LEAD = 2
    PREFER_FOLLOW = 3
    STRONG_FOLLOW = 4
"""
def createGraph():
    print("Creating graph")
    G = nx.Graph()
    G.add_nodes_from(students, bipartite=0)
    G.add_nodes_from(groups, bipartite=1)
    print(G.number_of_nodes())
    for student in students:
        for g in student.preferences:
            G.add_edge(student, g)
    print(G.number_of_edges())
    X, Y = bipartite.sets(G)
    pos = {}
    pos.update( (n, (1, i*2)) for i, n in enumerate(X) )
    pos.update( (n, (2, i*10)) for i, n in enumerate(Y) )

    nx.draw(G, with_labels=True, pos=pos, node_size=1)
    plt.show()
"""
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
def calcGroupPreference(known, learn):
    assert (known >= 0)
    assert (learn >= 0)
    pref = LEARN_WEIGHT * learn + KNOWN_WEIGHT * known
#    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
    return pref

##! This function registers students with each connected group and adds the
##! student to the group's preference list with the associated preference score
def registerUser(student, groups):
    known_score = 0
    learn_score = 0
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
        pref = calcGroupPreference(known_score, learn_score)
        groups[index].preferences[student] = pref
        for db_group in Groups.objects:
            if db_group.group_name == groups[index].group_name:
                db_group.preferences[student.student_name] =\
                groups[index].preferences[student]
                db_group.save()

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
            if s.leadership == "STRONG_LEAD":
                g.has_leader = True
            group_prefers[g] = partnerUpBitches(s, g)
            group_prefers[g] = nopeBitches(s, g)

        elif len(match) <= OPT_SIZE:
            #Open space in group
                if g.has_leader and s.leadership == "STRONG_LEAD" and\
                LEADERSHIP_MATTERS and len(s_list) > 1:
                    print(s.student_name + "not allowed in" + g.group_name)
                    students_free.append(s)
                else:
                    matched[g].append(s)
                    if s.leadership == "STRONG_LEAD":
                        g.has_leader = True
                    group_prefers[g] = partnerUpBitches(s, g)
                    group_prefers[g] = nopeBitches(s, g)

        else:
            g_list = group_prefers[g]
            replaced = False
            for m in match:
                if g_list.index(m) > g_list.index(s):
                    #replace less preferred student with current student
                    if g.has_leader and s.leadership == "STRONG_LEAD" and\
                    LEADERSHIP_MATTERS and len(s_list) > 1:
                        print(s.student_name + "not allowed in" + g.group_name)
                        continue
                    else:
                        matched[g].remove(m)
                        matched[g].append(s)
                        if s.leadership == "STRONG_LEAD":
                            g.has_leader = True
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
            print("MATCHING FAILED")

    return matched

def averagePreference(matched):
    prefs = []
    for g in matched:
        for s in matched[g]:
            index = 5 - len(s.preferences)
            prefs.append(index)
    avg_pref = numpy.mean(prefs)
    return avg_pref

# This function is a controller, basically it abstracts all the stuff that
# was in main. This way we can import this function when we want to call
# the sorting stuff from the server
##! This version of dumbledore creates a local copy of the db collections
##! and operates on them, but it makes updating the db cumbersome
def dumbledore():
    l_students = []
    l_groups = []
    for student in Students.objects:
        l_students.append(student)
    for group in Groups.objects:
        group.modify(members=[], preferences={})
        l_groups.append(group)
    for student in l_students:
        registerUser(student, l_groups)
    unpopular(l_groups)
    matched = sortThemBitches(l_students, l_groups)
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
