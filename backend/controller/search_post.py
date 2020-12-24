from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
import pymongo
from bs4 import BeautifulSoup
import re
from controller.categories import get_content_post, get_image_url, get_userid_from_token

@bp.route('/search', methods=['GET'])
@token_auth.login_required(optional=True)
def search_post_by_title():
    try:
        user_id = None
        if g.current_token != None:
            user_id = str(get_userid_from_token(str(g.current_token.show_token())))
        query = str(request.args.get('query', None))
        page = int(request.args.get('page', 1))

        if query == None:
            return {"data" : []}
        processed_query = re.sub('[\\?/\"\'\`{}()]+', '', query)
        print(processed_query)
        list_post = db["post"].find({
            "title" : {
                "$regex": str(processed_query),
                "$options" :'i'
            }})
        if(list_post == None):
            return {"data" : []}
        else:
            list_post = list(list_post)
            max_post = len(list_post)
            res ={
                "data" : [],
                "current_page" : page ,
                "total_page" : max_post
            }
            for index_page in range((page-1)*20, page*20):
                if(index_page >= len(list_post)):
                    break
                is_voted = 0
                if user_id != None:
                    if user_id in list_post[index_page]["voted_user"] and list_post[index_page]["voted_user"][user_id] != None:
                        is_voted = int(list_post[index_page]["voted_user"][user_id])
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
                    "url_image" : get_image_url(str(list_post[index_page]["content"])),
                    "is_voted" : is_voted
                })
            return res
    except Exception as exc:
        print(f"Error {exc}")
        abort(403)

if __name__=="__main__":
    print()