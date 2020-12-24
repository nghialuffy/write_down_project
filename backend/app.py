import os
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(ROOT_DIR, 'configuration.conf')


from flask import Blueprint, Flask
from flask_cors import CORS
from pymongo import MongoClient
from controller import *
import eventlet
from eventlet import wsgi

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
cors = CORS(app)

if __name__ == "__main__":
    try:
        app.register_blueprint(bp)
        # eventlet.wsgi.server(eventlet.listen(('103.113.83.246', 8006)), app, debug=True)
        app.debug = True
        app.run(threaded=True, host="0.0.0.0", port=5000)
    except Exception as exc:
        print(f"Error in main: {exc}")
    
