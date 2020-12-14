from flask import Blueprint, Flask
from pymongo import MongoClient


bp = Blueprint('api', __name__)
client = MongoClient('mongodb+srv://pikan:zpldDfKVSo1E6wDK@writedown.xtaf7.mongodb.net/')
db = client.write_down

from controller.register import *
from controller.login import *
from controller.user import *
from controller.postmonth import *
from controller.post import *
from controller.draft import *

