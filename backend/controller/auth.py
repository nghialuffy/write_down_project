from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from flask import abort, g
import hashlib
from controller import db
from controller.model import Token

basic_auth = HTTPBasicAuth()
token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verify_password(username, password):
    user = db.user.find_one({"username": username, "password": hashlib.md5(password.encode('utf-8')).hexdigest()})
    if user is None:
        return False
    g.current_token = Token(user['_id'])
    return True

@basic_auth.error_handler
def basic_auth_error():
    return abort(401)

@token_auth.verify_token
def verify_token(id_token):
    g.current_token = Token.check_token(id_token) if id_token else None
    return g.current_token is not None

@token_auth.error_handler
def token_auth_error():
    return abort(401)