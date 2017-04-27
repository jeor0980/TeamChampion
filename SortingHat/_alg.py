from mongoengine import *
import dbModels as m

GROUP_SIZE = 3

def recursiveSort(group, small_group):
    index = len(group.members) - 1

    if index > 2:
        for student in group.members:
            if student.second_pref == small_group.group_name:
                m.Groups.objects(group_name=group.group_name).update_one(
                    pull__members=student
                )
                m.Groups.objects(group_name=small_group.group_name).update_one(
                    push__members=student
                )
                break

        group_min = 100
        group_max = 0
        for group in m.Groups.objects:
            if len(group.members) < group_min:
                small_group = group
                group_min = len(group.members)
            if len(group.members) > group_max:
                large_group = group
                group_max = len(group.members)
        if group_max > 3:
            recursiveSort(large_group, small_group)
        else:
            return
    else:
        return

def sortThemBitches():
    m.Groups.objects.update(unset__members=1)
    for student in m.Students.objects:
        m.Groups.objects(group_name=student.first_pref).update_one(
            push__members=student
        )
    print("Finished the first pass!")
    print("Hmmm difficult... VERY difficult. Where to put you?")
    print("---------------------------------------------")
    group_min = 100
    group_max = 0
    for group in m.Groups.objects:
        if len(group.members) < group_min:
            small_group = group
            group_min = len(group.members)
        if len(group.members) > group_max:
            large_group = group
            group_max = len(group.members)
    recursiveSort(large_group, small_group)
    '''
    for group in m.Groups.objects:
        if len(group.members) < group_min:
            small_group = group
            group_min = len(group.members)
        recursiveSort(group, small_group)
    '''
    print("---------------------------------------------")
    print("well if you're sure, better be... GRYFFINDOR!")
