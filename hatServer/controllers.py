from flask_mongoengine import MongoEngine
from mongoengine import *
from flask import Flask, request, Response
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort
import json
import os

from hatServer import app

from hatServer.models import Groups, Students
from hatServer.sortingHat import sortingHat as alg

# This shouldn't be needed, should be handled in __init__.py
# app.config['MONGODB_DB'] = 'flask_test'


@app.route('/', methods=['GET', 'POST'])
def index():
    print ("TYPICAL BITCH")
    return render_template('index.html')

@app.route('/takeSurvey3', methods=['GET', 'POST'])
def create_survey():
    # get data from form object 
    print("TAKE SURVEY HOMES")
    data = json.loads(request.data.decode())

    firstName = data["firstName"]
    lastName = data["lastName"]
    #email = data["email"]
    comments = data["comments"]
    print(firstName)
    
    return firstName

class Groups(Document):
    group_name = StringField(required=True)
    members = ListField(ReferenceField(Students))

# This function will change once Jesus' code is checked in,
# but for now it just makes the login button not return 404
@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        flash('Login requested for identikey="%s", remember_me=%s' %
              (form.identikey.data, str(form.remember_me.data)))
        return basic_pages()
    return basic_pages()

@app.route('/sort', methods=['GET'])
def sort_students():
    alg.sortThemBitches()
    return display_sorted_groups()

@app.route('/display', methods=['GET'])
def display_sorted_groups():
    groups = []
    students = []
    for group in Groups.objects:
        groups.append(group.group_name)
        memberlist = []
        for student in group.members:
            memberlist.append(student.student_name)
        students.append(memberlist)
    return render_template('display.html', groups=groups, students=students)

@app.route('/drop/student', methods=['GET'])
def drop_students():
    Students.drop_collection()
    return index()

@app.route('/drop/group', methods=['GET'])
def drop_groups():
    groups.drop_collection()

@app.route('/add/student', methods=['POST'])
def add_student():
    try:
        identikey = request.form['identikey']
        name = request.form['student_name']
        first_pref = request.form['first_pref']
        second_pref = request.form['second_pref']
        cur_student = Students(identikey=identikey, student_name=name,
                               first_pref=first_pref, second_pref=second_pref)
        cur_student.save()
        return index()
    except:
        results = "Student Collection Error"
        errors = "Failed to add student to Database"
        return render_template('index.html', errors=errors, results=results)

@app.route('/add/group', methods=['POST'])
def add_group():
    try:
        group_name = request.form['group_name']
        cur_group = m.Groups(group_name=group_name)
        cur_group.save()
        return index()
    except:
        results = "Group Collection Error"
        errors = "Failed to add group to Database"
        return render_template('index.html', errors=errors, results=results)


#@app.route('/', methods=['GET', 'POST'])
def index():
#    Example:
    online_users = mongo.db.users.find({'online': True})
    return render_template('index.html',
                online_users=online_users)
    errors = []
    results = []
    for student in m.Students.objects[:10]:
        results.append(student)
    if request.method == "POST":
        try:
            identikey = request.form['identikey']
            name = request.form['student_name']
            first_pref = request.form['first_pref']
            second_pref = request.form['second_pref']
            cur_student = Student(identikey=identikey, student_name=name, first_pref=first_pref,
                                  second_pref=second_pref)
            results.append(cur_student)
            cur_student.save()
        except:
            errors.append(
                "Could not save student to database"
            )
        
    return render_template('index.html', errors=errors, results=results)

if __name__ == '__main__':
    app.run()
