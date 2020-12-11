from flask import abort, g, Flask, session
from mongo_access import *
import hashlib
from flask_restful import Resource
from flask_api import status
from cryptography.fernet import Fernet
from datetime import datetime
import yaml

with open("config.yaml", 'r') as stream:
    try:
        config = (yaml.safe_load(stream))
    except yaml.YAMLError as exc:
        print(exc)

secret_key = config["SECRETKEY"]

def format_reponse(status_code, status_message, data, msg_error, current_page = 1, total_page = 1):
    repons = {}
    repons['status'] = {'code': status_code, 'message': status_message}
    repons['result'] = {}
    repons['result']['data'] = data
    repons['result']['meta_data'] = {}
    repons['result']['meta_data']['request_ip'] = request.remote_addr
    repons['result']['meta_data']['current_page'] = current_page
    repons['result']['meta_data']['total_page'] = total_page
    repons['result']['error'] = msg_error
    return repons

def Encrypt(code):
    try:
        f = Fernet(secret_key)
        token = f.encrypt(code.encode())
        return token.decode()
    except Exception as e:
        print(e)
        return None

def Decrypt(code):
    try:
        f = Fernet(secret_key)
        token = f.decrypt(code.encode())
        return token.decode()
    except Exception as e:
        return None

def GenToken(username, deviceName):
    try:
        d = datetime.now()
        code = username + '|' + deviceName + '|' + str(d)
        token = Encrypt(code)
        return token
    except Exception as e:
        print('GenToken: %s' % e)
        return None

def VerifyToken(token):
    if token == None or token == '':
        return False, 'Invalid Token'
    code = Decrypt(token)
    if code != None:
        args = code.split('|')
        if len(args) == 3:
            print(args)
            if len(args) == 3:
                return status, "Ok"
            else:
                return False, 'Internal Server Error'
        else:
            return False, 'Invalid Token'
    else:
        return False, 'Invalid Token'

a = (InsertToken('nghialuffy', 'dell'))
print(a)
