import os
import json
from flask import Flask, request, Response
from flask import render_template, send_from_directory, url_for
from mongoengine import connect

app = Flask(__name__)

app.config.from_object('hatServer.config')
connect('sortingHat')
app.url_map.strict_slashes = False

import hatServer.models
import hatServer.controllers
