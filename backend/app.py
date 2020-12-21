import os
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT_DIR, 'configuration.conf')


from flask import Blueprint, Flask
from flask_socketio import SocketIO
from flask_cors import CORS
from pymongo import MongoClient
import eventlet
from eventlet import wsgi
from controller import *

app = Flask(__name__)
cors = CORS(app)
socketio = SocketIO(app, async_mode='eventlet')
if __name__ == "__main__":
    app.register_blueprint(bp)
    socketio.run(app,host='0.0.0.0', debug=True)