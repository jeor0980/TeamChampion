from mongoengine import *
import sys
sys.path.append("..")
sys.path.append("../..")
from hatServer.models import Groups, Students, Preference
from hatServer.sortingHat.variables import *

def writeVariableJson(data):
	if os.path.isfile("variables.json"):
		with open("variables_DEMO.json", 'w') as jsonFile:
			json.dump(data, jsonFile, indent=4)
	else:
		with open("./hatServer/static/js/config/variables_DEMO.json", 'w') as jsonFile:
			json.dump(data, jsonFile, indent=4)

def updateCountJson():
	data = loadVariableJson()

	count = Students.objects.count()
	data["STUDENT_COUNT"] = count

	writeVariableJson(data)

def convertNameToId(name):
	count = Students.objects(student_name=name).count()
	if count == 1:
		return Students.objects.get(student_name=name).identikey
	else:
		print("Counted " + str(count) + " results")
		print(name + " is not unique. Which student did you mean?")

def storeIdentikeyListJson():
	data = buildIdentikeyList()
	if os.path.isfile("id_map.json"):
		with open("id_map.json_DEMO", 'w') as fp:
			json.dump(data, fp, indent=4)
	else:
		with open("./hatServer/static/js/config/id_map_DEMO.json", 'w') as fp:
			json.dump(data, fp, indent=4)

def buildIdentikeyList():
	ids = {}
	for student in Students.objects:
		ids[student.student_name] = student.identikey
	return ids

def addWorkWith(student):
	# values = data.split('.')
	# student = Students.objects.get(identikey=values[2])
	names = student.temp_work_with
	for name in names:
		if name == '0':
			break
		identikey = convertNameToId(name)
		if identikey:
			student_to_work_with = Students.objects.get(identikey=identikey)
			student.update(add_to_set__work_with=student_to_work_with)
			student.reload()
	bad_names = student.temp_dont_work_with
	for name in bad_names:
		if name == '0':
			break
		identikey = convertNameToId(name)
		if identikey:
			student_to_avoid = Students.objects.get(identikey=identikey)
			student.update(add_to_set__dont_work_with=student_to_avoid)
			student.reload()
	student.save()

##! Use this to make list a group preferences for gale-shapley
def calcGroupPreference(known, learn, ip_score, ec):
	assert (known >= 0)
	assert (learn >= 0)
	assert (ip_score >= -1)
	pref = (learn + known + ip_score)
#    pref = pref/(KNOWN_WEIGHT + LEARN_WEIGHT)
	return pref

def registerStudents():
	storeIdentikeyListJson()
	updateCountJson()
	known_score = 0
	learn_score = 0
	ip_score = 0
	ec = 0
	for student in Students.objects:
		addWorkWith(student)
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