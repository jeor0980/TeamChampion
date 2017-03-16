import os
import sys
sys.path.insert(0, '/path/to/sortAlgorithm')
# print(os.getcwd())
import sortingHat
import unittest
import tempfile

class SortingHatTest(unittest.TestCase):

    # def setUp(self):
    #     #create new test client and initialize new db
    #     self.db_fd, sortingHat.app.config['DATABASE'] = tempfile.mkstemp()
    #     #diable error catching during request handling
    #     sortingHat.app.config['TESTING'] = True
    #     self.app = sortingHat.app.test_client()
    #     with sortingHat.app.app_context():
    #         sortingHat.init_db()

    def test_CalcStudentPreference(self):
        test1 = sortingHat.calcStudentPreference(.3, .3, .3)
        self.assertEqual(test1, 1.6985348)
        # test illegal arguments
        with self.assertRaises(AssertionError):
            sortingHat.calcStudentPreference(-1, 1, 1)

    def test_CalcGroupPreference(self):
        test1 = sortingHat.calcGroupPreference(.3, .3)
        self.assertEqual(test1, 0.1)
        # test illegal arguments
        with self.assertRaises(AssertionError):
            sortingHat.calcGroupPreference(-1, 1)

    def test_GroupSizeWithin(self):
        test1 = sortingHat.sortThemBitches()
            # Q: how to pull opt_size from sortThemBitches to test to adjust as needed?
            # A:
        self.assertTrue(len(test1) >= 4 and len(test1) <= 6)
        # test illegal arguments
        # with self.assertRaises(AssertionError):
        #     sortingHat.sortThemBitches([])
     
    # def test_GroupSizeEmpty(self):
    #     self.assertRaises(IndexError, sortThemBitches, [])    

    def test_NoDuplicateStudents(self):
        test1 = sortingHat.sortThemBitches()
            # Q: asking Hayden about format of matched
            # A:
        self.assertTrue(len(test1) == len(set(test1)))

    # def tearDown(self):
    #     #delete db after test
    #     os.close(self.db_fd)
    #     os.unlink(sortingHat.app.config['DATABASE'])

#go go go
if __name__ == '__main__':
    unittest.main()