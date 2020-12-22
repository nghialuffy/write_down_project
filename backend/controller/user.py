from controller import bp, db
from controller.model import Post, ObjectId
from flask import g, abort
from controller.auth import token_auth

@bp.route('/user/<id>', methods=['GET'])
@token_auth.login_required(optional=True)
def get_user(id):
    try:
        list_post = []
        user = db.user.find_one({"_id": ObjectId(id)},
                                {"password": 0, "link_facebook": 0, "email": 0, "list_draft": 0, "list_category": 0})
        if(user != None):
            if len(user["list_post"]) > 0:
                for id_post in user["list_post"]:
                    post = Post(db.post.find_one({"_id": id_post}))
                    list_post.append(post.get_mini_post(get_username=False))
            followings = len(list(db.user.find({"list_follow": user["_id"]})))

            rs={
                        "_id" : str(user["_id"]),
                        "username": user["username"],
                        "display_name": user["display_name"],
                        "avatar": user["avatar"],
                        "cover_img": user["cover_img"],
                        "bio": user["bio"],
                        "list_post": list_post,
                        "followings": followings,
                        "followers": len(user["list_follow"])
                    }

            if g.current_token is not None:
                token = g.current_token.get_token()
                if str(token.id_user) in user["list_follow"]:
                    rs["followed"] = 1
                else:
                    rs["followed"] = 0

            return rs
    except:
        abort(403)


@bp.route('/user/<id>/follow', methods=['POST'])
@token_auth.login_required
def follow(id):
    token = g.current_token.get_token()
    if id==str(token.id_user):
        abort(403)
    user=db.user.find_one({"_id": ObjectId(id)}, {"_id": 1, "list_follow": 1})
    if user["_id"]==token.id_user:
        abort(403)
    if str(token.id_user) in user["list_follow"]:
        abort(403)
    e=db.user.update_one({"_id": ObjectId(id)}, {"$push": {"list_follow": str(token.id_user)}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)


@bp.route('/user/<id>/unfollow', methods=['POST'])
@token_auth.login_required
def unfollow(id):
    token = g.current_token.get_token()
    if id==str(token.id_user):
        abort(403)
    user=db.user.find_one({"_id": ObjectId(id)}, {"_id": 1, "list_follow": 1})
    if str(token.id_user) not in user["list_follow"]:
        abort(403)
    e=db.user.update_one({"_id": ObjectId(id)}, {"$pull": {"list_follow": str(token.id_user)}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)

if __name__ == "__main__":
    # print(get_user("Araragikoyomioc"))
    pass
