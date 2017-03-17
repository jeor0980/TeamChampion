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
        csv_file = "test2014data.csv"
        self.data = sortingHat.dataSet(csv_file)
        self.students = []
        self.groups = []
        for line in self.data.readData:
            s = sortingHat.parseData(line)
            self.students.append(s)
        for name in sortingHat.group_names:
            g = sortingHat.createGroups(name)
            self.groups.append(g)
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

#    def testSortThemBitches():

    def tearDown(self):
#        os.close(self.db_fd)
#        os.unlink(sortingHat.app.config['DATABASE'])
        return

if __name__ == '__main__':
    unittest.main()
