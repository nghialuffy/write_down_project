from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
import pymongo
from bs4 import BeautifulSoup

def get_content_post(data):
    res = ""
    try:
        soup = BeautifulSoup(data, "lxml")
        full_text = soup.find_all(text=True)
        for raw_data in full_text:
            res += raw_data
    except Exception as exc:
        print("Error: " + exc)
    return res

def get_image_url(data):
    res = ""
    try:
        soup = BeautifulSoup(data, "lxml")
        img_soup = soup.find("img")
        if img_soup is not None:
            res = img_soup.get_attribute_list("src")[0]
    except Exception as exc:
        print("Error: " + exc)
    return res

def get_userid_from_token(token):
    res = ""
    try:
        query = db["session"].find({
            "_id" : token
        })
        if(query != None):
            res = list(query)[0]["id_user"]
    except Exception as exc:
        print("Error" + exc)
    return res

@bp.route('/categories/', defaults={'_id' : None})
@bp.route('/categories/<_id>', methods=['GET'])
@token_auth.login_required(optional=True)
def get_categories(_id):
    res = {}
    
    print(id)
    try:
        if _id != None:
            query = db["category"].find({"_id" : ObjectId(_id)})
            if query !=None:
                temp_res = list(query)[0]
                res["_id"] = str(temp_res["_id"])
                res["url"] = temp_res["url"]
                res["name_category"] = temp_res["name_category"]
                res["url_images"] = temp_res["url_images"]
                res["rule"] = temp_res["rule"]
                return res
        else:
            query = db["category"].find({})
            list_res = []
            if (query != None):
                for raw_data in list(query):
                    temp_res = {}
                    temp_res["_id"] = str(raw_data["_id"])
                    temp_res["url"] = raw_data["url"]
                    temp_res["name_category"] = raw_data["name_category"]
                    temp_res["url_images"] = raw_data["url_images"]
                    temp_res["rule"] = raw_data["rule"]
                    list_res.append(temp_res)
            res["data"] = list_res
            return res

    except Exception as exc:
        print(exc)
    abort(403)

# Get list category ma user follow
@bp.route('/categories/user/<_id>', methods=['GET'])
@token_auth.login_required(optional=True)
def get_category_user_follow(_id):
    try:
        user = db["user"].find_one({"_id" : ObjectId(_id)})
        if user != None:
            list_id_category = user["list_category"]
            res_category = []
            for id_category in list_id_category:
                temp_category = db["category"].find_one({"_id": ObjectId(id_category)})
                if(temp_category!=None):
                    temp_category["_id"] = str(temp_category["_id"])
                    res_category.append(temp_category)
            return {"data" : res_category}
    except Exception as exc:
        print(f"Error {exc}")
        abort(403)



@bp.route('/s/all/hot', methods=['GET'])
@token_auth.login_required(optional=True)
def get_hot_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"])),
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/all/controversial', methods=['GET'])
@token_auth.login_required(optional=True)
def get_controversial_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                    "_id": 1,
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
                    "_id": 1,
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/all/top', methods=['GET'])
@token_auth.login_required(optional=True)
def get_top_post_unverified():
    try:
        page = int(request.args.get('page', 1))
        if(page < 1):
            page = 1
        max_post = db["post"].find({},{"_id" : 1}).count()
        max_page = int(max_post/20)
        res ={
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res
        
    except Exception as exc:
        print(exc)
        abort(403)

@bp.route('/s/<category_name>/hot', methods = ['GET'])
@token_auth.login_required(optional=True)
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        abort(403)
    
@bp.route('/s/<category_name>/new', methods = ['GET'])
@token_auth.login_required(optional=True)
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        abort(403)


@bp.route('/s/<category_name>/controversial', methods = ['GET'])
@token_auth.login_required(optional=True)
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                    "_id": 1,
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
                    "_id": 1,
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"])),
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res
    except Exception as exc:
        abort(403)

@bp.route('/s/<category_name>/top', methods = ['GET'])
@token_auth.login_required(optional=True)
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"])),
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        abort(403)
# =================================================================================

@bp.route('/<category_name>/hot', methods = ['GET'])
@token_auth.login_required
def get_category_hot_verified(category_name):
    try:
        # print(str(g.current_token.show_token()))
        # user_id = get_userid_from_token(str(g.current_token.show_token()))
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        print("Error = " + str(exc))
        abort(403)
    
@bp.route('/<category_name>/new', methods = ['GET'])
@token_auth.login_required
def get_category_new_verified(category_name):
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"]))[0:200],
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        print(exc)
        abort(403)


@bp.route('/<category_name>/controversial', methods = ['GET'])
@token_auth.login_required
def get_category_controversial_verified(category_name):
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                    "_id": 1,
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
                    "_id": 1,
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"])),
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res
    except Exception as exc:
        abort(403)

@bp.route('/<category_name>/top', methods = ['GET'])
@token_auth.login_required
def get_category_top_verified(category_name):
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
            "data" : [],
            "current_page" : page ,
            "total_page" : max_post
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
                res["data"].append({
                    "created_by" : str(list_post[index_page]["created_by"]),
                    "category" : str(list_post[index_page]["category"]),
                    "time_to_read" : str(list_post[index_page]["time_to_read"]),
                    "title" : str(list_post[index_page]["title"]),
                    "created_date" : (list_post[index_page]["created_date"]),
                    "content" : get_content_post(str(list_post[index_page]["content"])),
                    "_id" : str(list_post[index_page]["_id"]),
                    "vote" : list_post[index_page]["vote"],
                    "views" : list_post[index_page]["views"],
                    "comments" : len(list_post[index_page]["list_comment"]),
                    "url_image" : get_image_url(str(list_post[index_page]["content"]))
                })
        return res

    except Exception as exc:
        abort(403)

@bp.route('/categories/<id>/follow', methods=['POST'])
@token_auth.login_required
def follow_category(id):
    token = g.current_token.get_token()
    try:
        db.category.find_one({"_id": ObjectId(id)})
    except:
        abort(403)
    e=db.user.update_one({"_id": token.id_user}, {"$push": {"list_category": id}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)


@bp.route('/categories/<id>/unfollow', methods=['POST'])
@token_auth.login_required
def unfollow_category(id):
    token = g.current_token.get_token()
    try:
        db.category.find_one({"_id": ObjectId(id)})
    except:
        abort(403)
    e = db.user.update_one({"_id": token.id_user}, {"$pull": {"list_category": id}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)



if __name__ == "__main__":
    print()