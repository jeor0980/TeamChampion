How to run: python2.7 naive_alg.py
  -takes no parameters

However, it does assume that you have a properly set up database
The database test_data on the EC2 instance is properly setup and should sort into the correct groupings
If you want to test it locally, it expects a database called test_data with collections called students and groups.
It expects students to have fields called 'student_name', 'first_pref' and 'second_pref'.  Anything else it ignores right or adds as needed.
Groups it expects to have 'group_name'.  It adds the members field.  It will also reset all the fields it changes so you can run it multiple times.
I've only tried it with group size of 3, 9 students grouped into 3 groups.
I doubt very much that it will work for anything else, it's pretty fragile as it is.

Please play with it and make it better
