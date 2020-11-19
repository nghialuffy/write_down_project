#!/usr/bin/python3
import pymongo
from flask import request
from json import dumps
from cryptography.fernet import Fernet
import base64, os
import logging
from datetime import datetime
import json
from bson import ObjectId
import re
from mongo_access import *
# password = b"nghialuffy!@#"
# salt = base64.urlsafe_b64encode(os.urandom(16))

# kdf = PBKDF2HMAC(
#         algorithm=hashes.SHA256(),
#         length=32,
#         salt=salt,
#         iterations=100000,
#         backend=default_backend()
#     )

secret_key = b'OLEyLH0cqdfOX8zrlbwz-_k77fzVoiMR9XBVjclmwIU='
# secret_key = base64.urlsafe_b64encode((password))

def format_reponse(status_code, status_message, data, msg_error, current_page = 1, total_page = 1):
    repons = {}
    repons['status'] = {'code': status_code, 'message': status_message}
    repons['result'] = {}
    repons['result']['data'] = data
    repons['result']['meta_data'] = {}
    repons['result']['meta_data']['location_data'] = {}
    repons['result']['meta_data']['location_data']['city_id'] = None
    repons['result']['meta_data']['location_data']['city_name'] = None
    repons['result']['meta_data']['location_data']['address'] = None
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

def VerifyToken(token):
    if token == None or token == '':
        return False, 'Invalid Token'
    code = Decrypt(token)
    if code != None:
        arr = code.split('|')
        if len(arr) == 3:
            print(agrs)
            db = ConnectMongoDB()
            listuser = db["user"].find({"username" : str(agrs[0])}, {})
            return True, "GG"
            # Find trong user => tra ve 

            # data = Execute_Stored('p_ValidateToken', agrs)

            # if data != None and len(data) > 0:
            #     status = data[0]['Error'] == 0
            #     msg = data[0]['Message']
            #     return status, msg
            else:
                return False, 'Internal Server Error'
        else:
            return False, 'Invalid Token'
    else:
        return False, 'Invalid Token'
    
def GenToken(username, deviceName):
    #1: Ma hoa
    try:
        d = int(datetime.now().timestamp())
        code = username + '|' + deviceName + '|' + str(d)
        token = Encrypt(code)
        return token
    except Exception as e:
        print('GenToken: %s' % e)
        return None

def SetPage(page):
    if page == None:
        return 0
    if not str(page).isnumeric():
        return 0
    if int(page) <= 1:
        return 0
    return int(page)

def SetLimit(limit):
    if limit == None:
        return 100
    if not str(limit).isnumeric():
        return 100
    if int(limit) < 0:
        return 100
    if int(limit) > 10000:
        return 10000
    return int(limit)

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

# print(GenToken('nghia', 'ubuntu'))

print(VerifyToken('gAAAAABftoHFpNSipKvCRteXdK8bVWA6banVQwsCsS50msEtmk5ih9EURG69c_GR81Oryb3ynjKtCFu5N8YBObpyZaOPHhft1vfOosWXMyu0icibQ8efE98='))
