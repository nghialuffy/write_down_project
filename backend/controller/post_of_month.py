from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId
from datetime import datetime

@bp.route('/postofmonth/', methods=['GET'])
@token_auth.login_required(optional=True)
def get_post_of_month():
    try:
        this_month = datetime(datetime.today().year, datetime.today().month, 1)
        list_post = []
        query = db["post"].find({
            "created_date" : {"$gt" : this_month}
        }).sort([
            ("vote", -1),
            ("views", -1)
        ]).limit(5)
        if(query!=None):
            list_post = list(query)
        res_post = {}
        list_res = []
        for post in list_post:
            temp_post = {
                "_id" : str(post["_id"]),
                "created_date" : post["created_date"],
                "created_by" : str(post["created_by"]),
                "title" : post["title"],
                "url_post" : post["url_post"]
            }
            list_res.append(temp_post)
        res_post["data"] = list_res
        return res_post
    except Exception as exc:
        abort(403)
    

if __name__ == "__main__":
    print()