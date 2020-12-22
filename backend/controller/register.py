from flask import request, abort
from controller.model import User
import hashlib
from controller import bp, db

@bp.route("/register", methods=['POST'])
def register():
    rq=request.json
    if not rq or not 'username' in rq or not 'password' in rq or not "display_name" in rq or not "email" in rq:
        abort(400)

    if db.user.find_one({"username": rq["username"]}) is not None:
        abort(409)

    try:
        user=User()
        user.username=rq['username']
        user.password=hashlib.md5(rq['password'].encode('utf-8')).hexdigest()
        user.display_name=rq['display_name']
        user.email=rq['email']
        db.user.insert_one(user.__dict__)
    except:
        abort(400)

    return "ok"