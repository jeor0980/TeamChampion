from mongoengine import *
from enum import Enum

import random
import dbModels
"""
Global variables here, not great but it works for now. Next step would be to
populate these through form input so that the instructor can change these as
we've planned. The skills list should also be handled differently at some
point, probably something else the instructor should populate.
"""
LEARN_WEIGHT = 0.2
KNOWN_WEIGHT = 0.1
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
Global groups are just a stand-in for the database connection
"""
students = []
group_names = ["A","B","C","D","E","F","G","H","I","J","K","L","M","P","R"]
groups = []

class dataSet:
    """
    Class to store csv formatted data from spreadsheet
    """
    def __init__(self, path):
        with open(path, "r") as myfile:
            self.readData = myfile.readlines()[1:]

##! Object to store student data, once connected to the db this will be a
##! document schema
class Student:
    def __init__(self, name, ik, prefs, ks, sl, dl):
        self.name = name
        self.identikey = ik
        self.preferences = prefs
        self.known_skills = ks
        self.skills_to_learn = sl
        self.desired_leadership = dl

##! Function that returns a formatted string representation of the class for
##! printing/debugging purposes
    def __str__(self):
        ret_str = "Name: {self.name}\nIdentikey: {self.identikey}\nPreferences\n: {self.preferences}\nKnown skills: {self.known_skills}\nSkills I want to learn: {self.skills_to_learn}\nLeadership: {self.desired_leadership}".format(self=self)
        return ret_str
##! These let the class be used as a dictionary key 
    def __hash__(self):
        return hash((self.name, self.identikey))

    def __eq__(self, other):
        return (self.name, self.identikey) == (other.name, other.identikey)

    def __ne__(self, other):
    # Not strictly necessary, but to
    # avoid having both x==y and x!=y
    # True at the same time
        return not(self == other)


##! Same thing for groups
class Group:
    def __init__(self):
        self.name = ""
        self.ident = ""
        self.members = []
        self.preferences = {}
        self.skills_needed = []
    def __hash__(self):
        return hash((self.name, self.ident))
    def __eq__(self):
        return (self.name, self.ident) == (other.name, other.location)
    def __ne__(self):
        return not(self == other)
    def __str__(self):
        ret_str = "Group name:\
            {self.name}\nPreferences:{self.preferences}\n".format(self=self)
        return ret_str

##! Takes in a list of group names, populates the global groups list and
##! randomly assigns its attributes. Just for testing obviously
def createGroups():
    for n in group_names:
        group = Group()
        group.name = n
        group.ident = n
        random_count = random.randint(0, len(SKILLZ))
        group.skill_needed = random.sample(SKILLZ, random_count)
        groups.append(group)

##! Parses the csv file. Again, just for testing stuff. I haven't tried it with
##! other test data, but just keep the fields the same and formatted correctly
##! and it should work just fine.
def parseData(data):
    values = data.split(',')
    name = values[0] + " " + values[1]
    identikey = values[2]
    known = values[3].split('.')
    learn = values[4].split('.')
    lead = values[5]
    """
    Here, the preference dictionary should store references to the group,
    rather than just a mapping of group name to preference score. Could just
    make this a list?
    """
    """
    pref1 = [g for g in groups if g.name == values[6]]
    pref2 = [g for g in groups if g.name == values[7]]
    pref3 = [g for g in groups if g.name == values[8]]
    pref4 = [g for g in groups if g.name == values[9]]
    pref5 = [g for g in groups if g.name == values[10]]
    pref_dict = {
        pref1 : 5, pref2 : 4, pref3 : 3, pref4 : 2, pref5 : 1
    }
    """
    prefs = []
    for i in range(6, 11):
        for g in groups:
            if g.name == values[i]:
                prefs.append(g)

    if lead == "NO_PREF":
        lead = Lead.NO_PREF
    elif lead == "STRONG_LEAD":
        lead =  Lead.STRONG_LEAD
    elif lead == "PREFER_LEAD":
        lead = Lead.PREFER_LEAD
    elif lead == "STRONG_FOLLOW":
        lead = Lead.STRONG_FOLLOW
    elif lead == "PREFER_FOLLOW":
        lead = Lead.PREFER_FOLLOW

    student_to_add = Student(name, identikey, prefs, known, learn, lead)
    students.append(student_to_add)

#This function combines all variables, but unused in current implementation
#May be more applicable to a hungarian algorithm approad
def calcStudentPreference(known, learn, preference):
    # weight variables. This should be more extensible to account
    # for multiple possible variables
    pref = 5 * 1/preference + LEARN_WEIGHT * learn + \
            KNOWN_WEIGHT * known
    pref = pref/(1 + LEARN_WEIGHT + KNOWN_WEIGHT)
    # return a value normalized between 0 and 1
    return (pref - 1)/(8 - 1)

##! Use this to make list a group preferences for gale-shapley
def calcGroupPreference(known, learn):
    pref = LEARN_WEIGHT * learn + KNOWN_WEIGHT * known
    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
    return pref/3 # group pref range is 0-3, so normalize between 0 and 1

##! This function registers students with each connected group and adds the
##! student to the group's preference list with the associated preference score
def registerUser(student):
    known_score = 0
    learn_score = 0
    for grp in student.preferences:
        # How to weight group preferences for students?
        for attr in grp.skills_needed:
            if attr in student.known_skills and known_score < 10:
                known_score += 1 
            if attr in student.skills_to_learn and learn_score < 10:
                learn_score += 1
        grp.preferences[student] = calcGroupPreference(known_score, learn_score)

##! This is an implementation of the Gale/Shapley algorithm. It's modeled off
##! of this code: https://rosettacode.org/wiki/Stable_marriage_problem#Python
def sortThemBitches():
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
        g = s_list.pop(0)
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
                    if student_prefers[m]:
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

    return matched

##! You know what this is
def main(args):
    if (len(args) > 1):
        data = dataSet(args[1])
        createGroups()
        for line in data.readData:
            parseData(line)
        for student in students:
            registerUser(student)
#        for group in groups:
#            print(group)

        matches = sortThemBitches()
        for key in matches:
            value = matches[key]
            print("{key.name}:".format(key=key))
            for student in value:
                print("\t{student.name}".format(student=student))
    else:
        print("Usage: SH_parser [filePath]")

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))