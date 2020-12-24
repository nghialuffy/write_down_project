from flask import Blueprint, Flask
from pymongo import MongoClient


bp = Blueprint('api', __name__)
client = MongoClient('mongodb+srv://haihuynh:rb04Oe88i9FpVgG3@cluster0.jlv3c.mongodb.net/test')
db = client.write_down

from controller.register import *
from controller.login import *
from controller.user import *
from controller.post import *
from controller.draft import *
from controller.post_of_month import *
from controller.categories import *
from controller.notification import *
from controller.top_user import *
from controller.search_post import *
from controller.for_you import *
