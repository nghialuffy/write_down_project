from flask import request, abort, g
from controller import bp, db
from controller.auth import token_auth
from bson.objectid import ObjectId
from controller.model import Post

@bp.route("/foryou", methods=['GET'])
@token_auth.login_required()
def for_you():
    try:
        token = g.current_token.get_token()
        user=db.user.find_one({"_id": token.id_user}, {"_id":0, "list_read": 1, "list_hashtag": 1})
        list_post=[]
        count=0
        for hashtag in user["list_hashtag"]:
            list_post_hashtag=list(db.post.find({"list_hashtag": hashtag}))
            for dict_post in list_post_hashtag:
                post=Post(dict_post)
                if not str(post._id) in user["list_read"]:
                    list_post.append(post.get_micro_post())
                    count+=1
                if count>=5:
                    break
            if count >= 5:
                break
        return {"for_you": list_post}
    except:
        abort(403)