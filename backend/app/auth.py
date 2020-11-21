from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask import abort, g
import hashlib
from app import db

basic_auth = HTTPBasicAuth()


@basic_auth.verify_password
def verify_password(username, password):
    user = db.user.find_one({"username": username, "password": hashlib.md5(password.encode('utf-8')).hexdigest()})
    if user is None:
        return False
    g.current_id_user = user['_id']
    return True

@basic_auth.error_handler
def basic_auth_error():
    return abort(401)