from mongoengine import *

class Students(Document):
    identikey = StringField(required=True, unique=True)
    student_name = StringField(required=True)
    first_pref = StringField(required=True)
    second_pref = StringField(required=True)

class Groups(Document):
    group_name = StringField(required=True)
    members = ListField(ReferenceField(Students))
