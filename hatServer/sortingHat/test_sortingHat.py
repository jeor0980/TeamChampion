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

    @classmethod
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

    def testCalcGroupPreference(self):
        test1 = registerStudents.calcGroupPreference(3, 3, 2, 1)
        self.assertEqual(test1, 8)
        with self.assertRaises(AssertionError):
            registerStudents.calcGroupPreference(-1, 1, -1.5, 1)

    def testNoEnemies(self):
        for g in self.matched:
            for s in self.matched[g]:
                if len(s.dont_work_with) > 0:
                    for se in s.dont_work_with:
                        message = se.student_name + " in " + g.group_name
                        self.assertTrue(se not in self.matched[g], message)

    def testGroupSize(self):
        for g in self.matched:
            self.assertTrue(len(self.matched[g]) >= MIN_SIZE)
            self.assertTrue(len(self.matched[g]) <= MAX_SIZE)

    def testAllStudents(self):
        count = 0
        ids = []
        groupSize = []
        for g in self.matched:
            groupSize.append(len(self.matched[g]))
            for s in self.matched[g]:
                count += 1
                ids.append(s.identikey)
        self.assertEqual(count, STUDENT_COUNT, ids)

    def testNoDuplicateStudents(self):
        students = []
        for g in self.matched:
            for s in self.matched[g]:
                self.assertNotIn(s, students, s.student_name)
                students.append(s)
    
    def testForStrongLeaders(self):
        if LEADERSHIP_MATTERS:
            for g in self.matched:
                strong_leader_present = False
                for s in self.matched[g]:
                    if strong_leader_present:
                        message = (s.student_name + " is in " +
                            g.group_name + " with another strong leader")
                        self.assertNotEqual(s.leadership, "STRONG_LEAD", message)
                    elif s.leadership == "STRONG_LEAD":
                        strong_leader_present = True
                    else:
                        self.assertTrue(True)

"""
    def testSortThemStudents(self):
        csv_file = "test2014data.csv"
        group_csv_file = "groups.csv"
        data = sortingHat.dataSet(csv_file)
        group_data = sortingHat.dataSet(group_csv_file)
        students = []
        groups = []
        for line in group_data.readData:
            g = sortingHat.parseGroups(line)
            groups.append(g)
        for line in data.readData:
            s = sortingHat.parseData(line)
            print(s.preferences)
            students.append(s)
        for student in students:
            print(student.preferences)
            sortingHat.registerUser(student, groups)
        for grp in groups:
            print(grp.preferences)
        matched = sortingHat.sortThemStudents(students, groups)
        self.assertEqual(len(matched), len(groups))
        count = 0
        for group, students in matched:
            count += len(students)
        self.assertEqual(count, len(students))
"""
"""
    def tearDown(self):
#        os.close(self.db_fd)
#        os.unlink(sortingHat.app.config['DATABASE'])
        return
"""
if __name__ == '__main__':
    unittest.main()
