#!/usr/bin/python3
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from datetime import datetime
from Controller.homepage import HomePage
import logging
import os
#
if(not os.path.isdir('logs')):
    os.mkdir('logs')
logging.basicConfig( filename= "./logs/" + datetime.now().strftime('%Y%m%d') + '.log',
                            filemode='a',
                            format='%(levelname)s:\t%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                            datefmt='%H:%M:%S',
                            level=logging.ERROR)

app = Flask(__name__)
api = Api(app)


api.add_resource(HomePage, '/')



if __name__ == '__main__':
    try:
        #app.debug = True
        # app.run(host='127.0.0.1', port=8001) # api Dev
        # app.run(host='127.0.0.1', port=9001) # api Production
        app.run(host='0.0.0.0', port=5001)
    except Exception as e:
        print('Error: ', e)