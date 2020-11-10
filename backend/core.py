#!/usr/bin/python3
from flask import request
from json import dumps
from mySQL_access import *
from cryptography.fernet import Fernet
import base64, os
import logging
from datetime import datetime
import json
from bson import ObjectId
import re

password = b"Tpos@2010@!#"
salt = os.urandom(16)

# kdf = PBKDF2HMAC(
#     algorithm=hashes.SHA256(),
#     length=32,
#     salt=salt,
#     iterations=100000,
#     backend=default_backend()
# )

secret_key = b'6thcFJNH4oBlppaughEZtJSjT1hWVxyeUKuSbL8TBZs='
#secret_key = base64.urlsafe_b64encode(kdf.derive(password))

dic_dauso = {"086", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039", "089", "090", "093",
                 '058', "070", "079", "077", "076", "078", '088', '091', '094', '081', '082', '083', '084', '085', '092', '056', "099", "059"}

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
            agrs = (token, str(arr[0]))
            data = Execute_Stored('p_ValidateToken', agrs)

            if data != None and len(data) > 0:
                status = data[0]['Error'] == 0
                msg = data[0]['Message']
                return status, msg
            else:
                return False, 'Internal Server Error'
        else:
            return False, 'Invalid Token'
    else:
        return False, 'Invalid Token'
    
def GenToken(username, deviceName):
    #1: Ma hoa
    try:
        #d = datetime.now()
        code = username + '|' + deviceName + '|121212' #+ d.strftime('%Y-%m-%d %H:%M:%S')
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

def Check_Not_Phone(phoneNumber):
    phone_char = re.match(r'.*[a-zA-Z!@#$%^&*.()_+\\/\- ].*', phoneNumber)  # số điện thoại có kí tự
    if phone_char:  # nếu số điện thoại nằm trong format đó
        return phone_char.group()   # trả về số điện thoại đó
    if len(phoneNumber) != 10 or phoneNumber[:3] not in dic_dauso:
        return phoneNumber
    return None

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

    