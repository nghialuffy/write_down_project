import os
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

CONFIG_PATH = os.path.join(ROOT_DIR, 'configuration.conf')

from controller import *

if __name__ == "__main__":
    app = Flask(__name__)
    app.register_blueprint(bp)
    app.run(host="0.0.0.0", debug=True)