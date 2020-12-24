import os
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT_DIR, 'configuration.conf')


from flask import Blueprint, Flask
import socketio
from flask_cors import CORS
from pymongo import MongoClient
from controller import *
import eventlet
from eventlet import wsgi

app = Flask(__name__)
cors = CORS(app)

if __name__ == "__main__":
    app.register_blueprint(bp)
    # app = socketio.ASGIApp(sio, app)
    # eventlet.wsgi.server(eventlet.listen(('', 5000)), app, debug=True)
    app.run(threaded=True, port=9999, debug=True)
