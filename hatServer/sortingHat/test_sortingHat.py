import os
import sys
sys.path.insert(0, '..')
import sortingHat
import unittest
import tempfile

class SortingHatTest(unittest.TestCase):

    def setUp(self):
#        self.db_fd, sortingHat.app.config['DATABASE'] = tempfile.mkstemp()
#        sortingHat.app.config['TESTING'] = True
#        self.app = sortingHat.test_client()
#        with sortingHat.app.app_context():
#            sortingHat.init_db()
        return

    def testCalcStudentPreference(self):
        test1 = sortingHat.calcStudentPreference(.3, .3, .3)
        self.assertEqual(round(test1, 2), round(1.6985348, 2))
        with self.assertRaises(AssertionError):
            sortingHat.calcStudentPreference(-1, 1, 1)

    def testCalcGroupPreference(self):
        test1 = sortingHat.calcGroupPreference(.3, .3)
        self.assertEqual(round(test1, 1), 0.1)
        with self.assertRaises(AssertionError):
            sortingHat.calcGroupPreference(-1, 1)

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

    def tearDown(self):
#        os.close(self.db_fd)
#        os.unlink(sortingHat.app.config['DATABASE'])
        return

if __name__ == '__main__':
    unittest.main()
