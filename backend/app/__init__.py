from flask import Blueprint, Flask
from pymongo import MongoClient

bp=Blueprint('api', __name__)
client=MongoClient('mongodb+srv://pikan:zpldDfKVSo1E6wDK@writedown.xtaf7.mongodb.net/')
db=client.write_down

from app.register import *
from app.login import *

if __name__=="__main__":
    app=Flask(__name__)
    app.register_blueprint(bp)
    app.run()