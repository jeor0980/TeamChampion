from mongoengine import *
from enum import Enum

class Students(Document):
    meta = {
        'collection': 'students'
    }
    identikey = StringField(required=True, unique=True)
    student_name = StringField(required=True)
    known_skills = ListField(StringField())
    learn_skills = ListField(StringField())
    leadership = StringField() 
    preferences = ListField(StringField())

class Groups(Document):
    meta = {
        'collection': 'groups'
    }

    group_name = StringField(required=True, unique=True)
    members = ListField(ReferenceField(Students))
    skills = ListField(StringField())
    preferences = DictField()
