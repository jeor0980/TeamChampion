from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

##! Use this to make list a group preferences for gale-shapley
def calcGroupPreference(known, learn, ip_score, ec):
	assert (known >= 0)
	assert (learn >= 0)
	assert (ip_score >= -1)
	pref = (learn + known + ip_score)
#    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
	return pref

def registerStudents():
	known_score = 0
	learn_score = 0
	ip_score = 0
	ec = 0
	for student in Students.objects:
		for group in student.preferences:
			for attr in group.skills:
				if attr in student.known_skills and known_score < MAX_SKILL_LEN:
					known_score += KNOWN_WEIGHT
				if attr in student.learn_skills and learn_score < MAX_SKILL_LEN:
					learn_score += LEARN_WEIGHT
			if student.ip_pref == 'NO_PREF':
				ip_score = 0
			elif student.ip_pref == 'RETAIN' and group.ip == 'OPEN':
				ip_score = IP_WEIGHT
			else:
				ip_score = -IP_WEIGHT
			if student.extra_credit:
				ec = EXTRA_CREDIT
			pref = calcGroupPreference(known_score, learn_score, ip_score, ec)
			pref_doc = Preference(student=student, pref_score=pref)
			Groups.objects(
				group_name=group.group_name
				).update(
				add_to_set__preferences=pref_doc)