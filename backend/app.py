from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_restful import Resource, Api
from datetime import datetime
import yaml
import logging
import os


# Write log
if(not os.path.isdir('logs')):
    os.mkdir('logs')
logging.basicConfig( filename= "./logs/" + datetime.now().strftime('%Y%m%d') + '.log',
                            filemode='a',
                            format='%(levelname)s:\t%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.ERROR)
# Load file yaml
with open("config.yaml", 'r') as stream:
    try:
        config = (yaml.safe_load(stream))
    except yaml.YAMLError as exc:
        print(exc)

app = Flask(__name__)
api = Api(app)

if __name__=="__main__":
    app.debug = True
    app.run(host='0.0.0.0', port=5001)