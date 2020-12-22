from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
import pymongo
from bs4 import BeautifulSoup


@bp.route('/topuser/', methods=['GET'])
@token_auth.login_required(optional=True)
def get_top_user():
    try:
        res = {}
        query = db["user"].aggregate([
            {
                "$project":{
                    "_id" : 1,
                    "username" : 1,
                    "display_name" : 1,
                    "email" : 1,
                    "link_facebook": 1,
                    "avatar": 1,
                    "bio": 1,
                    "post" : { "$sum" : "$list_post"}
                }
            },{
                "$sort":{
                    "post" : -1
                }
            },{
                "$limit" : 20
            },{
                "$project" :{
                    "_id" : 1,
                    "username" : 1,
                    "display_name" : 1,
                    "email" : 1,
                    "link_facebook": 1,
                    "avatar": 1,
                    "bio": 1,
                }
            }
        ])
        if(query != None):
            list_top_user = list(query)
            list_res = []
            for row_data in list_top_user:
                temp_res ={}
                temp_res["_id"] = str(row_data["_id"])
                temp_res["username"] = str(row_data["username"])
                temp_res["display_name"] = str(row_data["display_name"])
                temp_res["email"] = str(row_data["email"])
                temp_res["link_facebook"] = str(row_data["link_facebook"])
                temp_res["avatar"] = str(row_data["avatar"])
                temp_res["bio"] = str(row_data["bio"])
                list_res.append(temp_res)
            res["data"] = list_res
            return res 
    except Exception as exc:
        print(f"Error: {exc}")
    abort(401)