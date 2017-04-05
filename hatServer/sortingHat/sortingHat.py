from mongoengine import *
from enum import Enum
import csv
import sys
sys.path.append("..")
from models import Groups, Students
import buildDB

import random

"""
Global variables here, not great but it works for now. Next step would be to
populate these through form input so that the instructor can change these as
we've planned. The skills list should also be handled differently at some
point, probably something else the instructor should populate.
"""
MAX_SKILL_LEN = 10
LEARN_WEIGHT = 0.2
KNOWN_WEIGHT = 0.1
GROUP_WEIGHT = 5.0
MIN_SIZE = 4
MAX_SIZE = 6
OPT_SIZE = 5

SKILLZ = ["VG", "DB", "ES", "WA", "MA", "UI", "ST", "NW", "SC", "ML", "RB", "CV", "AL", "AI"]

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
    pref = pref/(1 + LEARN_WEIGHT + KNOWN_WEIGHT)
    # return a value normalized between 0 and 1
    return (pref - 1)/(8 - 1)

##! Use this to make list a group preferences for gale-shapley
def calcGroupPreference(known, learn):
    assert (known >= 0)
    assert (learn >= 0)
    pref = LEARN_WEIGHT * learn + KNOWN_WEIGHT * known
    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
    return pref # group pref range is 0-3, so normalize between 0 and 1

##! This function registers students with each connected group and adds the
##! student to the group's preference list with the associated preference score
def registerUser(student, groups):
    known_score = 0
    learn_score = 0
    for grp_name in student.preferences:
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
        groups[index].preferences[student] = calcGroupPreference(known_score, learn_score)

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
            print(group.group_name + " is unpopular")

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
        g_name = s_list.pop(0)
        index = 0
        g = None
        for group in groups:
            if group.group_name == g_name:
                g = group
        
        match = matched.get(g)
        if not match:
            # group has no matches yet
            matched[g] = [s]

        elif len(match) < OPT_SIZE:
            #Open space in group
            matched[g].append(s)

        else:
            g_list = group_prefers[g]
            replaced = False
            for m in match:
                if g_list.index(m) > g_list.index(s):
                    #replace less preferred student with current student
                    matched[g].remove(m)
                    matched[g].append(s)
                    if len(student_prefers[m]) > 0:
                        students_free.append(m)
                    else:
                        #No op, but this will break things, so here's one
                        #solution, but:
                        #TODO: make this work better
                        if len(match) < MAX_SIZE:
                            matched[g].append(m)
                    replaced = True
                    break
            if not replaced:
                if s_list:
                    students_free.append(s)
                else:
                    if len(match) < MAX_SIZE:
                        matched[g].append(s)

    for group in matched:
        for student in matched[group]:
            group.members.append(student)
    for group in matched:
        if len(group.members) < MIN_SIZE:
            swapThemBitches(group, True, groups)
            if len(group.members) < MIN_SIZE:
                swapThemBitches(group, False, groups)

    for group in matched:
        matched[group] = group.members

    return matched

def dumbledore():
    l_students = []
    l_groups = []
    #connect('testDB')
    for student in Students.objects:
        l_students.append(student)
    for group in Groups.objects:
        l_groups.append(group)
    for student in l_students:
        registerUser(student, l_groups)
    unpopular(l_groups)
    sortThemBitches(l_students, l_groups)
    for group in l_groups:
        value = group.members
        print(group.group_name + ":")
        for student in value:
            print("\t{student.student_name}".format(student=student))
 
##! You know what this is
def main(args):
    connect('testDB')
    # buildDB.buildDB(args[1], args[2])
    dumbledore()

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
