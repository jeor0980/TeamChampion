#! /usr/bin/env python
from pymongo import MongoClient
import pprint
from bson.json_util import dumps


GROUP_SIZE = 3

def recursiveSort(students, groups, group_cursor, small_group_name):
    id = group_cursor['_id']
    group = groups.find_one({'_id' : id})
    print "Checking group: " + group['group_name']
    index = len(group['members']) - 1
    print str(index + 1) + " members"
    if index > 2:
        student_obj = students.find_one({
            'second_pref' : small_group_name
        })
        while 'second_pref_selected' in student_obj:
            index -= 1
            student_obj = students.find_one({
                'student_name' : group['members'][index]
            })

        print group['members']
        print student_obj['student_name']
        groups.find_one_and_update(
            {'_id' : id}, {'$pull' : {'members' : student_obj['student_name']}}
        )
        print groups.find_one({'_id' : id})['members']
        groups.find_one_and_update(
            {'group_name' : student_obj['second_pref']}, {'$push' : {'members' : student_obj['student_name']}}
        )
        students.update_one({'_id' : student_obj['_id']}, {'$set' :
                                                           {'second_pref_selected'
                                                            : 'True'}})

        group_min = 100
        group_max = 0
        small_group_name = ""
        large_group_name = ""
        raw_input("press enter to continue...")
        for group in groups.find():
            if len(group['members']) < group_min:
                small_group_name = group['group_name']
                group_min = len(group['members'])
            if len(group['members']) > group_max:
                large_group_name = group['group_name']
                group_max = len(group['members'])
        recursiveSort(students, groups, group, small_group_name)
    else:
        return

def sortThemBitches(students, groups):
    print "running"
    groups.update({}, {'$unset' : {'members' : 1}}, multi=True)
    for student in students.find():
        pprint.pprint(student["student_name"])
        print "adding " + student["student_name"] + " to group " \
        + student["first_pref"]
        groups.find_one_and_update({'group_name' : student['first_pref']},
                                   {'$push' : {'members' :
                                               student['student_name']}})
    print "finished first pass!"
    print "---------------------------------------------------"
    group_min = 100
    group_max = 0
    small_group_name = ""
    large_group_name = ""
    for group in groups.find():
        if len(group['members']) < group_min:
            small_group_name = group['group_name']
            group_min = len(group['members'])
        if len(group['members']) > group_max:
            large_group_name = group['group_name']
            group_max = len(group['members'])
        recursiveSort(students, groups, group, small_group_name)

def main(args):
    
    client = MongoClient()
    db = client.test_data
    student_collection = db.students
    group_collection = db.groups
    sortThemBitches(student_collection, group_collection)

if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
