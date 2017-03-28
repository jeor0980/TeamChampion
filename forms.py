from flask_wtf import Form
from wtforms import TextField, BooleanField, StringField
from wtforms.validators import DataRequired

class LoginForm(Form):
    identikey = TextField('identikey', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])
    remember_me = BooleanField('remember_me', default=False)