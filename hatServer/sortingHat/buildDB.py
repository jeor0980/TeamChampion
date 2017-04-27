from mongoengine import *
import json
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students
from hatServer.sortingHat.masterSort import * 

class dataSet:
    """
    Class to store csv formatted data from spreadsheet
    """
    def __init__(self, path):
        with open(path, 'r') as myfile:
            self.readData = myfile.readlines()[1:]

def parseStudent(data):
    values = data.split(',')
    student_to_add = Students(
        student_name=values[0] + " " + values[1],
        identikey=values[2],
        known_skills=values[3].split('.'),
        learn_skills=values[4].split('.'),
        leadership=values[5],
        ip_pref=values[6]
    )
    student_to_add.save()
    prefs = []
    for i in range(7, 12):
#    for i in range(6, 9):
        g_name = values[i].rstrip('\n')
        group_to_add = Groups.objects.get(group_name=g_name)
        student_to_add.update(add_to_set__preferences=group_to_add)
        #print(group_to_add.group_name)
    student_to_add.save()
    return student_to_add

def convertNameToId(name):
    count = Students.objects(student_name=name).count()
    if count == 1:
        Students.objects.get(student_name=name).identikey
    else:
        print("Counted " + str(count) + " results")
        print(name + " is not unique. Which student did you mean?")

def updateCountJson():
    with open("variables.json", "r") as jsonFile:
        data = json.load(jsonFile)

    count = Students.objects.count()
    data["STUDENT_COUNT"] = count

    with open("variables.json", "w") as jsonFile:
        json.dump(data, jsonFile, indent=4)

def storeIdentikeyListJson():
    data = buildIdentikeyList()
    with open('id_map.json', 'w') as fp:
        json.dump(data, fp, indent=4)

def buildIdentikeyList():
    ids = {}
    for student in Students.objects:
        ids[student.student_name] = student.identikey
    return ids

def addWorkWith(data):
    values = data.split(',')
    student = Students.objects.get(identikey=values[2])
    names = values[12].rstrip('\n').split('.')
    for name in names:
        if name == '0':
            break
        identikey = convertNameToId(name)
        if identikey:
            student_to_work_with = Students.objects.get(identikey=identikey)
            student.update(add_to_set__work_with=student_to_work_with)
    bad_names = values[13].rstrip('\n')
    bad_names = bad_names.split('.')
    for name in bad_names:
        if name == '0':
            break
        identikey = convertNameToId(name)
        if identikey:
            student_to_avoid = Students.objects.get(identikey=identikey)
            student.update(add_to_set__dont_work_with=student_to_avoid)
    student.save()

def parseGroups(data):
    values = data.split(',')
    group_to_add = Groups(group_name=values[0])
    group_to_add.save()
    paid = bool(int(values[1]))
    group_to_add.update(paid=paid)
    group_to_add.update(ip=values[2])
    option = bool(int(values[3]))
    group_to_add.update(option=option)
    if option:
        group_to_add.update(opt_category=values[4])
    skills = []
    for i in range(5, len(values)):
        skill = values[i].rstrip('\n')
        group_to_add.update(add_to_set__skills=skill)
#    group_to_add.update(remove_from_set__skills='\n')
#    skills.remove('\n')
#    print(skills)
   # group_to_add.skills = skills
   # group_to_add.save()
#    group_to_add.members = []
#    group_to_add.save(cascade=True)
    return group_to_add

def buildDB(student_path, group_path):
    #assert(len(student_path) > 0)
    if len(Groups.objects.all()) > 0:
        Groups.drop_collection()
    if len(Students.objects.all()) > 0:
        Students.drop_collection()
    student_data = dataSet(student_path)
    group_data = dataSet(group_path)
    for line in group_data.readData:
        g = parseGroups(line)
        # TODO add proper mongoengine command here if this doesn't work
    for line in student_data.readData:
        s = parseStudent(line)
    for line in student_data.readData:
        s_with = addWorkWith(line)
    storeIdentikeyListJson()
    updateCountJson()

def main(args):
    register_connection('testDatabase')
    connect('testDatabase')
    if len(Groups.objects.all()) > 0:
        Groups.drop_collection()
    if len(Students.objects.all()) > 0:
        Students.drop_collection()
    buildDB(args[1], args[2])

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
