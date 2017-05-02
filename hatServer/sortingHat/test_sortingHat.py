import os
import sys
sys.path.append('..')
sys.path.append("../..")
import sortingHat
import preprocessGroups
import masterSort
import registerStudents
import unittest
import tempfile
from mongoengine import *
from hatServer.models import Students, Groups
import numpy
from variables import *

class SortingHatTest(unittest.TestCase):

    # need the @classmethod decorator in order to call setUpClass on cls rather than self
    @classmethod
    # setUpClass allows us to have more than one test method
    def setUpClass(cls):
#        self.db_fd, sortingHat.app.config['DATABASE'] = tempfile.mkstemp()
#        sortingHat.app.config['TESTING'] = True
#        self.app = sortingHat.test_client()
#        with sortingHat.app.app_context():
#            sortingHat.init_db()
        super(SortingHatTest, cls).setUpClass()
        # cls.ret, cls.matched = sortingHat.dumbledore()
        cls.matched = sortingHat.dumbledore()
        return

    # # ensure that logic is correct in algorithm's calculation of group preference
    # def testCalcGroupPreference(self):
    #     # call calcGroupPreference with a possible input
    #     test1 = registerStudents.calcGroupPreference(3, 3, 2, 1)
    #     # PASS: test passes if calcGroupPreference returns the expected value, in this case 8
    #     self.assertEqual(test1, 8)
    #     with self.assertRaises(AssertionError):
    #         registerStudents.calcGroupPreference(-1, 1, -1.5, 1)

    # ENSURE that no students are grouped with students they asked to not work with
    def testNoEnemies(self):
        for g in self.matched:
            for s in self.matched[g]:
                # For each student in each group, if they have requested to avoid another student,
                # show which student is listed as a "do not wish to work with __" and check
                # if that student is in the group the current student is being placed in
                if len(s.dont_work_with) > 0:
                    for se in s.dont_work_with:
                        message = se.student_name + " in " + g.group_name

                        # PASS: test passes if no enemies are detected as being placed in the same group
                        # FAIL: if test fails, message will print with student/group causing the issue
                        self.assertTrue(se not in self.matched[g], message)

    # ENSURE that group size is within constraints set by instructor
    def testGroupSize(self):
        for g in self.matched:

            # PASS: test passes if size of each group is within size limits set in variables.py
            self.assertTrue(len(self.matched[g]) >= MIN_SIZE)
            self.assertTrue(len(self.matched[g]) <= MAX_SIZE)

    # ENSURE that all students have been placed in a group
    def testAllStudents(self):
        count = 0
        ids = []
        groupSize = []
        for g in self.matched:
            # for each group, record number of students in groupSize
            groupSize.append(len(self.matched[g]))

            # for each student in the group, increment number of students grouped
            # and record identikey in ids
            for s in self.matched[g]:
                count += 1
                ids.append(s.identikey)

        # PASS: test passes if number of students grouped = known number of students
        # FAIL: if test fails, the list of identikeys will be displayed for the instructor to review
        self.assertEqual(count, STUDENT_COUNT, ids)

    # ENSURE that no students are grouped more than once
    def testNoDuplicateStudents(self):
        students = []
        for g in self.matched:
            for s in self.matched[g]:

                # PASS: test passes if student name does not exist in list students that have already
                #       been grouped (list: students)
                # FAIL: if test fails, the student name causing the issue will be displayed
                self.assertNotIn(s, students, s.student_name)

                #when student is grouped, add name to list students
                students.append(s)
    
    # CHECK if students listed as "must be a leader" are grouped with another "must be a leader"
    def testForStrongLeaders(self):
        # this test is only run if instructor sets LEADERSHIP_MATTERS = TRUE in variables.py
        if LEADERSHIP_MATTERS:
            for g in self.matched:
                # strong leader is not present, initialize as false
                strong_leader_present = False
               
                for s in self.matched[g]:
                    # if this group is known to have a strong leader, alert instructor
                    if strong_leader_present:
                        message = (s.student_name + " is in " +
                            g.group_name + " with another strong leader")

                        # PASS: test passes if every group has <= 1 strong leader
                        # FAIL: if test fails, message is printed identifying the names of the strong
                        #       leaders that have been grouped together and the group they are in
                        self.assertNotEqual(s.leadership, "STRONG_LEAD", message)

                    # if a student in the group has labeled themselves as a strong leader,
                    # change flag to reflect that this group already has a strong leader
                    elif s.leadership == "STRONG_LEAD":
                        strong_leader_present = True
                    else:
                        self.assertTrue(True)

"""
    def tearDown(self):
#        os.close(self.db_fd)
#        os.unlink(sortingHat.app.config['DATABASE'])
        return
"""
if __name__ == '__main__':
    unittest.main()
