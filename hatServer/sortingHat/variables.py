import json
import sys
import os
sys.path.append('..')
sys.path.append('../..')

def loadJson():
	if os.path.isfile("variables.json"):
		with open("variables.json", 'r') as fp:
			data = json.load(fp)
			return data
	else:
		with open("./hatServer/sortingHat/vaiables.json", 'r') as fp:
			data = json.load(fp)
			return data

data = loadJson()

MAX_SKILL_LEN = data['MAX_SKILL_LEN']
LEARN_WEIGHT = data['LEARN_WEIGHT']
KNOWN_WEIGHT = data['KNOWN_WEIGHT']
GROUP_WEIGHT = data['GROUP_WEIGHT']
IP_WEIGHT = data['IP_WEIGHT']
MIN_SIZE = data['MIN_SIZE']
MAX_SIZE = data['MAX_SIZE']
OPT_SIZE = data['OPT_SIZE']
LEADERSHIP_MATTERS = data['LEADERSHIP_MATTERS']
STUDENT_COUNT = data['STUDENT_COUNT']
SUBVERT_FOR_PAY = data['SUBVERT_FOR_PAY']
MIN_PAID_AVG_PREF_SCORE = data['MIN_PAID_AVG_PREF_SCORE']
EXTRA_CREDIT = data['EXTRA_CREDIT']

# cfg = configparser.RawConfigParser()
# cfg.read(["./hatServer/sortingHat/variables.cfg", "variables.cfg"])

# MAX_SKILL_LEN = cfg.getint('Vars', 'MAX_SKILL_LEN')
# LEARN_WEIGHT = cfg.getfloat('Vars', 'LEARN_WEIGHT')
# KNOWN_WEIGHT = cfg.getfloat('Vars', 'KNOWN_WEIGHT')
# GROUP_WEIGHT = cfg.getfloat('Vars', 'GROUP_WEIGHT')
# IP_WEIGHT = cfg.getfloat('Vars', 'IP_WEIGHT')
# MIN_SIZE = cfg.getint('Vars', 'MIN_SIZE')
# MAX_SIZE = cfg.getint('Vars', 'MAX_SIZE')
# OPT_SIZE = cfg.getint('Vars', 'OPT_SIZE')
# ##! This has the potential to cause unstable matching. It
# ##! should eventually yield a match, but matching may fail
# ##! unexpectedly for an indeterminate number of runs. It will
# ##! default to False, but if you want to try and get rid of any
# ##! strong leader warnings that arise just be aware you may have
# ##! to run multiple iterations before a satisfactory match is
# ##! acchieved. Issues are usually that it underfills a group, 
# ##! and that it fails to actually avoid a two leader scenario.
# LEADERSHIP_MATTERS = cfg.getboolean('Vars', 'LEADERSHIP_MATTERS')
# STUDENT_COUNT = cfg.getint('Vars', 'STUDENT_COUNT')
# ##! This value is also somewhat unstable. If running with subver
# ##! enabled, if you get errors or failed matchings, play with the 
# ##! min_paid value. It works better if multiple groups are changed
# ##! rather than only one low scoring group.
# SUBVERT_FOR_PAY = cfg.getboolean('Vars', 'SUBVERT_FOR_PAY')
# MIN_PAID_AVG_PREF_SCORE = cfg.getfloat('Vars', 'MIN_PAID_AVG_PREF_SCORE')
