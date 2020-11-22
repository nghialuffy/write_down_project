from flask import request, abort
from controller.model import User, db
import hashlib
from controller import bp

@bp.route("/register", methods=['POST'])
def register():
    rq=request.json
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