MAX_SKILL_LEN = 10
LEARN_WEIGHT = 0.2
KNOWN_WEIGHT = 0.1
GROUP_WEIGHT = 5.0
IP_WEIGHT = 0.5
MIN_SIZE = 4
MAX_SIZE = 6
OPT_SIZE = 5
##! This has the potential to cause unstable matching. It
##! should eventually yield a match, but matching may fail
##! unexpectedly for an indeterminate number of runs. It will
##! default to False, but if you want to try and get rid of any
##! strong leader warnings that arise just be aware you may have
##! to run multiple iterations before a satisfactory match is
##! acchieved. Issues are usually that it underfills a group, 
##! and that it fails to actually avoid a two leader scenario.
LEADERSHIP_MATTERS = False
STUDENT_COUNT = 72
##! This value is also somewhat unstable. If running with subver
##! enabled, if you get errors or failed matchings, play with the 
##! min_paid value. It works better if multiple groups are changed
##! rather than only one low scoring group.
SUBVERT_FOR_PAY = True
MIN_PAID_AVG_PREF_SCORE = 3.5
