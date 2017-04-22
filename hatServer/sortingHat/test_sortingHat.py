import os
import sys
sys.path.append('..')
sys.path.append("../..")
import sortingHat
import unittest
import tempfile
from mongoengine import *
from hatServer.models import Students, Groups
import numpy

class SortingHatTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
#        self.db_fd, sortingHat.app.config['DATABASE'] = tempfile.mkstemp()
#        sortingHat.app.config['TESTING'] = True
#        self.app = sortingHat.test_client()
#        with sortingHat.app.app_context():
#            sortingHat.init_db()
        super(SortingHatTest, cls).setUpClass()
        cls.matched = sortingHat.dumbledore()
        cls.identikeys = \
        ['172','271','370','469','568','a667','766','865','964','1063','1162','1261','1360','1459','1558','1657','1756','1855','1954','2053','2152','2251','2350','2449','2548','2647','2746','2845','2944','3043','3142','3241','3340','3439','3538','3637','3736','3835','3934','4033','4132','4231','4330','4429','4528','4627','4726','4825','4924','5023','5122','5221','5320','5419','5518','5617','5716','5815','5914','6013','6112','6211','6310','649','658','667','676','685','694','703','712','721']
        return

    def testCalcStudentPreference(self):
        test1 = sortingHat.calcStudentPreference(3, 3, 3)
        self.assertEqual(round(test1, 2), round(2.566666, 2))
        with self.assertRaises(AssertionError):
            sortingHat.calcStudentPreference(-1, 1, 1)

    def testCalcGroupPreference(self):
        test1 = sortingHat.calcGroupPreference(3, 3)
        self.assertEqual(round(test1, 1), 0.9)
        with self.assertRaises(AssertionError):
            sortingHat.calcGroupPreference(-1, 1)

    def testNoEnemies(self):
        for g in self.matched:
            for s in self.matched[g]:
                if len(s.dont_work_with) > 0:
                    for se in s.dont_work_with:
                        self.assertTrue(se not in self.matched[g])

    def testFriends(self):
        studentsWithFriends = []
        for g in self.matched:
            for s in self.matched[g]:
                if len(s.work_with) > 0:
                    studentsWithFriends.append(s)

    def testGroupSize(self):
        for g in self.matched:
            self.assertTrue(len(self.matched[g]) >= 4)
            self.assertTrue(len(self.matched[g]) <= 6)

    def testAllStudents(self):
        count = 0
        ids = []
        groupSize = []
        for g in self.matched:
            groupSize.append(len(self.matched[g]))
            for s in self.matched[g]:
                count += 1
                ids.append(s.identikey)
        diff = list(set(self.identikeys)-set(ids))
        print(numpy.mean(groupSize))
        print(diff)
        self.assertEqual(count, 72)

    def testNoDuplicateStudents(self):
        students = []
        for g in self.matched:
            for s in self.matched[g]:
                self.assertNotIn(s, students)
                students.append(s)

"""
    def testSortThemBitches(self):
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
        matched = sortingHat.sortThemBitches(students, groups)
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
