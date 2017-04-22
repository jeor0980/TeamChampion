from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students
import hatServer.sortingHat.leadership as l

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
        leadership=values[5]
    )
    student_to_add.save()
    prefs = []
    for i in range(6, 11):
        g_name = values[i].rstrip('\n')
        group_to_add = Groups.objects.get(group_name=g_name)
        student_to_add.update(add_to_set__preferences=group_to_add)
        #print(group_to_add.group_name)
    student_to_add.save()
    return student_to_add

def addWorkWith(data):
    values = data.split(',')
    student = Students.objects.get(identikey=values[2])
    ids = values[11].split('.')
    print("IDs: " + values[11])
    for identikey in ids:
        if identikey == '0':
            break
        print("\tSearching for identikey: " + identikey)
        student_to_work_with = Students.objects.get(identikey=identikey)
        student.update(add_to_set__work_with=student_to_work_with)
    student.save()

def parseGroups(data):
    values = data.split(',')
    group_to_add = Groups(group_name=values[0])
    group_to_add.save()
    skills = []
    for i in range(2, len(values)):
        group_to_add.update(add_to_set__skills=values[i])
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
    student_data = dataSet(student_path)
    group_data = dataSet(group_path)
    for line in group_data.readData:
        g = parseGroups(line)
        # TODO add proper mongoengine command here if this doesn't work
    for line in student_data.readData:
        s = parseStudent(line)
    for line in student_data.readData:
        s_with = addWorkWith(line)

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
