from flask import Blueprint, request, jsonify, Flask, abort
from model import User, db
import hashlib
bp = Blueprint('api', __name__)

@bp.route("/register", methods=['POST'])
def register():
    rq=request.json
    print(rq)
    if not rq or not 'username' in rq or not 'password' in rq:
        abort(400)
    
    try:
        user=User()
        user.username=rq['username']
        user.password=hashlib.md5(rq['password'].encode('utf-8')).hexdigest()
        db.user.insert_one(user.__dict__)
    except:
        abort(400)

    return "ok"

if __name__=="__main__":
    app=Flask(__name__)
    app.register_blueprint(bp)
    app.run()