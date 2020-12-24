import os
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT_DIR, 'configuration.conf')


from flask import Blueprint, Flask
import socketio
from flask_cors import CORS
from pymongo import MongoClient
from controller import *

app = Flask(__name__)
cors = CORS(app)

if __name__ == "__main__":
    try:
        app.register_blueprint(bp)
        app.debug = True
        app.run(threaded=True, host="0.0.0.0", port=9999)
    except Exception as exc:
        print(f"Error in main: {exc}")
    
