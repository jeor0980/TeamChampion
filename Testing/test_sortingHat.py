import os
import sys
sys.path.insert(0, '/path/to/sortingHat')
import sortingHat
import unittest
import tempfile

class SortingHatTest(unittest.TestCase):

    def setUp(self):
        #create new test client and initialize new db
        self.db_fd, sortingHat.app.config['DATABASE'] = tempfile.mkstemp()
        #diable error catching during request handling
        sortingHat.app.config['TESTING'] = True
        self.app = sortingHat.app.test_client()
        with sortingHat.app.app_context():
            sortingHat.init_db()

    def tearDown(self):
        #delete db after test
        os.close(self.db_fd)
        os.unlink(sortingHat.app.config['DATABASE'])

#go go go
if __name__ == '__main__':
    unittest.main()