Files:

  sortingHat.py - The algorithm, with a couple extra functions for potential later use

  test2014data.csv - The formatted student data.  Some fields were eliminated and/or combined in order to fit the current
  variable fields.

To run: python3 sortingHat.py test2014data.csv

Prints out the group and students in each group.

Bugs: right now it doesn't handle removing excess groups, so it will just make a couple groups that are below the minimum size. I think we can handle removing groups either in pre-processing, or as part of the sort but the logic isn't there yet.

Testing: All I've done so far is eyeball it to see if it looks like people are getting their preferences. Definitely need to build some functional testing sooner rather than later.

Options: I also want to try this using a single edge weight rather than the group/student preference lists and the Hungarian algorithm (linear assignment algorithm). See which one works better, or if there's even a difference
