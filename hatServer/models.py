from mongoengine import *

class Preference(EmbeddedDocument):
    student = ReferenceField('Students')
    pref_score = FloatField()

class Students(Document):
    meta = {
        'collection': 'students'
    }
    group_assigned = ReferenceField('Groups')
    identikey = StringField(required=True, unique=True)
    student_name = StringField(required=True)
    known_skills = ListField(StringField())
    learn_skills = ListField(StringField())
    leadership = StringField() 
    preferences = ListField(ReferenceField('Groups'))
    work_with = ListField(ReferenceField('self'))
    dont_work_with = ListField(ReferenceField('self'))
    temp_work_with = ListField(StringField())
    temp_dont_work_with = ListField(StringField())
    ip_pref = StringField()

class Groups(Document):
    meta = {
        'collection': 'groups'
    }

    group_name = StringField(required=True, unique=True)
    members = ListField(ReferenceField(Students))
    skills = ListField(StringField())
#    preferences = SortedListField(EmbeddedDocumentField(Preference),
#                                 ordering="pref_score", reverse=True)
    preferences = DictField()
    paid = BooleanField()
    has_leader = BooleanField()
    has_strong_leader = BooleanField()
    ip = StringField()
