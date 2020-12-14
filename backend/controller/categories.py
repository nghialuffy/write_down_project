from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
import pymongo

@bp.route('/s/all/hot', methods=['GET'])
# @token_auth.login_required(optional=True)
def get_hot_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
        }).sort([
            ("views", -1)
        ]).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/all/new', methods=['GET'])
# @token_auth.login_required(optional=True)
def get_new_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
        }).sort(
            "created_date", -1
        ).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/all/controversial', methods=['GET'])
# @token_auth.login_required(optional=True)
def get_controversial_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        query = db["post"].aggregate([
            {
                "$project":{
                    "created_by" : 1,
                    "category" : 1,
                    "time_to_read" : 1,
                    "title" : 1,
                    "created_date" : 1,
                    "content": 1,
                    "url_post": 1,
                    "vote": 1,
                    "views": 1,
                    "list_comment" : 1,
                    "comment" : { "$sum" : "$list_comment"}
                }
            },{
                "$sort":{
                    "comment" : -1
                }
            },{
                "$limit" : page*20
            },{
                "$project" :{
                    "created_by" : 1,
                    "category" : 1,
                    "time_to_read" : 1,
                    "title" : 1,
                    "created_date" : 1,
                    "content": 1,
                    "url_post": 1,
                    "vote": 1,
                    "views": 1,
                    "list_comment" : 1
                }
            }
        ])

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/all/top', methods=['GET'])
# @token_auth.login_required(optional=True)
def get_top_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
        }).sort([(
            "vote", -1
        )]).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/<category_name>/hot', methods = ['GET'])
def get_category_hot(category_name):
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        category = db["category"].find({
            "url" : category_name
        },{"_id":1})
        category_id = None
        if(category !=None):
            category_id = list(category)[0]
            # print(category_id)
        if(category_id == None):
            abort(403)
        max_post = db["post"].find({"category" : category_id["_id"]},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
            "category" : category_id["_id"]
        }).sort([
            ("views", -1)
        ]).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res

    except Exception as exc:
        abort(403)
    
@bp.route('/s/<category_name>/new', methods = ['GET'])
def get_category_new(category_name):
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        category = db["category"].find({
            "url" : category_name
        },{"_id":1})
        category_id = None
        if(category !=None):
            category_id = list(category)[0]
            # print(category_id)
        if(category_id == None):
            abort(403)
        max_post = db["post"].find({"category" : category_id["_id"]},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
            "category" : category_id["_id"]
        }).sort(
            "created_date", -1
        ).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res

    except Exception as exc:
        abort(403)


@bp.route('/s/<category_name>/controversial', methods = ['GET'])
def get_category_controversial(category_name):
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        category = db["category"].find({
            "url" : category_name
        },{"_id":1})
        category_id = None
        if(category !=None):
            category_id = list(category)[0]
            # print(category_id)
        if(category_id == None):
            abort(403)
        max_post = db["post"].find({"category" : category_id["_id"]},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].aggregate([{
            "$find":{
                "category" : category_id["_id"]
            }
        },
            {
                "$project":{
                    "created_by" : 1,
                    "category" : 1,
                    "time_to_read" : 1,
                    "title" : 1,
                    "created_date" : 1,
                    "content": 1,
                    "url_post": 1,
                    "vote": 1,
                    "views": 1,
                    "list_comment" : 1,
                    "comment" : { "$sum" : "$list_comment"}
                }
            },{
                "$sort":{
                    "comment" : -1
                }
            },{
                "$limit" : page*20
            },{
                "$project" :{
                    "created_by" : 1,
                    "category" : 1,
                    "time_to_read" : 1,
                    "title" : 1,
                    "created_date" : 1,
                    "content": 1,
                    "url_post": 1,
                    "vote": 1,
                    "views": 1,
                    "list_comment" : 1
                }
            }
        ])

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res
    except Exception as exc:
        abort(403)

@bp.route('/s/<category_name>/top', methods = ['GET'])
def get_category_top(category_name):
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        category = db["category"].find({
            "url" : category_name
        },{"_id":1})
        category_id = None
        if(category !=None):
            category_id = list(category)[0]
            # print(category_id)
        if(category_id == None):
            abort(403)
        max_post = db["post"].find({"category" : category_id["_id"]},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : {
            },
            "current_page" : page ,
            "max_page" : max_page
        }
        if(max_page < page):
            return res
        
        query = db["post"].find({
            "category" : category_id["_id"]
        }).sort([(
            "vote", -1
        )]).limit(page*20)

        list_post = []
        if(query!=None):
            list_post = list(query)
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                res["data"][str(index_page)] = {
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : str(list_post[index_page]["content"]),
                    "url_post" : str(list_post[index_page]["url_post"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"])
                }
        return res

    except Exception as exc:
        abort(403)
if __name__ == "__main__":
    print()