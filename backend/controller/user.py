from controller import bp, db
from controller.model import Post, ObjectId
from flask import g, abort, request
from controller.auth import token_auth
import hashlib

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
                for i in range(len(list_post)-1):
                    haveSwap = False
                    for j in range(len(list_post)-i-1):
                        if list_post[j]["created_date"] < list_post[j+1]["created_date"]:
                            temp=list_post[j]
                            list_post[j]=list_post[j+1]
                            list_post[j+1]=temp
                            haveSwap = True
                    if not haveSwap:
                        break
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
                        "followers": len(user["list_follow"]),
                        "sex": user["sex"],
                        "birthday": user["birthday"]
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

@bp.route('/profile', methods=['PUT'])
@token_auth.login_required
def update_profile():
    try:
        token = g.current_token.get_token()
        rq = request.json
        if not rq:
            abort(400)
        update={}
        if "display_name" in rq:
            update["display_name"]=rq["display_name"]
        if "email" in rq:
            update["email"] = rq["email"]
        if "avatar" in rq:
            update["avatar"] = rq["avatar"]
        if "cover_img" in rq:
            update["cover_img"] = rq["cover_img"]
        if "bio" in rq:
            update["bio"] = rq["bio"]
        if "sex" in rq:
            update["sex"]=rq["sex"]
        if "birthday" in rq:
            update["birthday"]=rq["birthday"]

        e=db.user.update_one({"_id": token.id_user}, {"$set": update})
        if e.matched_count > 0:
            return "ok"
        else:
            abort(403)
    except:
        abort(403)

@bp.route('/update_password', methods=["PUT"])
@token_auth.login_required
def update_password():
    token = g.current_token.get_token()
    rq = request.json
    if not rq or not "old_password" in rq or not "new_password" in rq:
        abort(400)
    if db.user.find_one({"_id": token.id_user, "password": hashlib.md5(rq["old_password"].encode('utf-8')).hexdigest()}) is None:
        abort(405)
    e=db.user.update_one({"_id": token.id_user}, {"$set": {"password": hashlib.md5(rq["new_password"].encode('utf-8')).hexdigest()}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)

@bp.route('/user/<id>/ban', methods=['POST'])
@token_auth.login_required(role="admin")
def ban(id):
    e=db.user.update_one({"_id": ObjectId(id)}, {"$set": {"ban": 1}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)

@bp.route('/user/<id>/unban', methods=['POST'])
@token_auth.login_required(role="admin")
def unban(id):
    e=db.user.update_one({"_id": ObjectId(id)}, {"$set": {"ban": 0}})
    if e.matched_count > 0:
        return "ok"
    else:
        abort(403)

@bp.route('/user/<id>/follower', methods=['GET'])
@token_auth.login_required(optional=True)
def get_follower(id):
    user = db.user.find_one({"_id": ObjectId(id)},
                            {"_id": 0, "list_follow": 1})
    rs=[]
    for follower_id in user["list_follow"]:
        follower=db.user.find_one({"_id": ObjectId(follower_id)}, {"_id": 1, "display_name": 1, "avatar": 1, "list_follow": 1})
        follow_dict={"_id": str(follower["_id"]), "display_name": follower["display_name"], "avatar": follower["avatar"], "num_follow": len(follower["list_follow"])}
        if g.current_token is not None:
            token = g.current_token.get_token()
            follow_dict["followed"]=0
            if str(token.id_user) in follower["list_follow"]:
                follow_dict["followed"]=1
        rs.append(follow_dict)
    return {"follower": rs}

@bp.route('/user/<id>/following', methods=['GET'])
@token_auth.login_required(optional=True)
def get_following(id):
    list_follow = list(db.user.find({"list_follow": id},
                            {"_id": 1, "display_name": 1, "avatar": 1, "list_follow": 1}))
    rs=[]
    for follower in list_follow:
        follow_dict={"_id": str(follower["_id"]), "display_name": follower["display_name"], "avatar": follower["avatar"], "num_follow": len(follower["list_follow"])}
        if g.current_token is not None:
            token = g.current_token.get_token()
            follow_dict["followed"]=0
            if str(token.id_user) in follower["list_follow"]:
                follow_dict["followed"]=1
        rs.append(follow_dict)
    return {"following": rs}

@bp.route('/listuser/<page>')
@token_auth.login_required(role="admin")
def get_list_user(page):
    if page!=None and page.isnumeric():
        page=int(page)
    else:
        abort(403)
    if page<=0:
        abort(403)
    try:
        if int(page)==0:
            list_user=list(db.user.find({}, {"_id": 1, "display_name": 1, "username": 1, "avatar": 1}).limit(20))
        else:
            list_user = list(db.user.find({}, {"_id": 1, "display_name": 1, "username": 1, "avatar": 1}).skip(
                (int(page) - 1) * 20).limit(20))
        for user in list_user:
            user["_id"]=str(user["_id"])
        return {"list_user": list_user}
    except:
        abort(403)

if __name__ == "__main__":
    # print(get_user("Araragikoyomioc"))
    pass
