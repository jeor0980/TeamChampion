#! /usr/bin/env python
from pymongo import MongoClient
from enum import Enum

class skills(Enum):
    JAVA = 1
    PYTHON = 2
    PHP = 3
    C = 4
    MOB_APP_DEV = 5
    WEB_APP = 6
    EMB_SYS = 7
    DATABASE = 8
    UI_UX = 9
    STATS = 10
    NETWORKING = 11
    ROBOTICS = 12
    COMP_VISION = 13
    ALGORITHMS = 14
    MACHINE_LEARNING = 15
    VIDEO_GAME_DEV = 16
    SECURITY = 17
    GRAPHICS = 18
    AI = 19
    C_SHARP = 20
    PERFORMANCE = 21
    JAVASCRIPT = 22

class dataSet:
    """
    Class to store csv formatted data from spreadsheet
    """
    def __init__(self, path):
        with open(path, "r") as myfile:
            self.readData = myfile.readlines()

def makeDoc(data):
    headers = ["timestamp", "username", "first_name", "last_name", "pref_name", "gpa",
               "cs_gpa", "overall_exp", "video_game_exp", "db_exp", "embedded_sys_exp",
               "web_app_exp", "mobile_app_exp", "UI_exp", "stats_exp", "networking_exp",
               "security_exp", "skill_improvement", "first_pref", "second_pref",
               "third_pref", "fourth_pref", "fifth_pref", "ip_pref", "ldrshp_role",
               "allowed", "not_allowed"]
    doc = {}
    values = data.split(',')
    for index in range(0, len(headers)):
        doc[headers[index]] = values[index]
        if (index == 17):
            doc[headers[index]] = doc[headers[index]].split('.')
            print doc[headers[index]]
    return doc


def main(args):
    if (len(args) > 1):
        data = dataSet(args[1])
    else:
        print "Usage: SH_parser [filePath]"
    
    client = MongoClient()
    db = client.data_2014
    collection = db.students
    count = 0
    for line in data.readData:
        doc = makeDoc(line)
        result = collection.insert_one(doc)
        print result.inserted_id
        count += 1
        print count


if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))
