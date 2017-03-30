from hatServer import app

from flask_mongoengine import MongoEngine
from flask_mongorest import MongoRest

db = MongoEngine(app)
api = MongoRest(app)
