from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId


def get_comment(data_cmt, is_reply=False):
    cmt = {"_id": str(data_cmt["_id"]), "content": data_cmt["content"], "created_date": data_cmt["created_date"],
           "vote": data_cmt["vote"],
           "created_by": str(data_cmt["created_by"])}
    if g.current_token is not None:
        token = g.current_token.get_token()
        if str(token.id_user) in data_cmt["voted_user"]:
            cmt["user_voted"] = data_cmt["voted_user"][str(token.id_user)]

    if not is_reply:
        cmt["list_comment"] = []
        for data_reply in data_cmt["list_comment"]:
            cmt["list_comment"].append(get_comment(data_reply, True))
    return cmt


@bp.route('/post/<id>', methods=['GET'])
@token_auth.login_required(optional=True)
def get_post(id):
    try:
        post = {}
        data = db.post.find_one({"_id": ObjectId(id)}, {"_id": 0, "url_post": 0, "time_to_read": 0})
        post["title"] = data["title"]
        post["content"] = data["content"]
        post["created_date"] = data["created_date"]
        post["list_hashtag"] = data["list_hashtag"]
        post["vote"] = data["vote"]
        post["views"] = data["views"] + 1
        post["edit_history"] = len(data["edit_history"]) > 0
        category = db.category.find_one({"_id": data["category"]}, {"_id": 1, "name_category": 1, "url": 1})
        post["category"] = str(category["_id"])

        user = db.user.find_one({"_id": data["created_by"]}, {"_id": 1, "display_name": 1, "avatar": 1})
        post["created_by"]=str(user["_id"])
        post["list_comment"] = []
        for data_cmt in data["list_comment"]:
            post["list_comment"].append(get_comment(data_cmt))

        if g.current_token is not None:
            token = g.current_token.get_token()
            if str(token.id_user) in data["voted_user"]:
                post["user_voted"] = data["voted_user"][str(token.id_user)]

        db.post.update_one({"_id": ObjectId(id)}, {"$set": {"views": data["views"] + 1}})
        return post
    except:
        abort(403)


@bp.route('/post/<id>/edit-history', methods=['GET'])
def get_post_edit_history(id):
    try:
        edit_history = db.post.find_one({"_id": id}, {"_id": 0, "edit_history": 1})["edit_history"]
        list_history = []
        for id_draft in edit_history:
            list_history.append(db.draft.find_one({"_id": id_draft}, {"_id": 0, "created_by": 0, "category": 0}))
        return {"list_history": list_history}
    except:
        abort(403)


@bp.route('/post', methods=['POST'])
@token_auth.login_required
def post_post():
    token = g.current_token.get_token()

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    post = Post()
    post.title = rq["title"]
    post.content = rq["content"]
    post.created_date = datetime.now()
    post.list_hashtag = rq["list_hashtag"]
    post.category = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]
    post.created_by = token.id_user
    post.time_to_read = get_time_to_read(post.content)
    post.url_post = get_url_post(post.title)

    post.insert_to_db()
    return str(post._id)


@bp.route('/post/<id>', methods=['PUT'])
@token_auth.login_required
def put_post(id):
    token = g.current_token.get_token()

    pre_post = Post(db.post.find_one({"_id": ObjectId(id)}))
    if token.id_user != pre_post.created_by:
        abort(405)

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    try:
        category_id = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]

        if pre_post.title == rq["title"] and pre_post.content == rq["content"] and pre_post.list_hashtag == rq[
            "list_hashtag"] and pre_post.category == category_id:
            return id
        draft_hictory = pre_post.toDraft()
        draft_hictory.insert_to_db()

        db.post.update_one({"_id": ObjectId(id)},
                           {
                               "$set": {
                                   "title": rq["title"],
                                   "content": rq["content"],
                                   "list_hashtag": rq["list_hashtag"],
                                   "category": category_id,
                                   "time_to_read": get_time_to_read(rq["content"])
                               },
                               "$push": {
                                   "edit_history": draft_hictory._id
                               }
                           })
    except:
        abort(403)
    return id


@bp.route('/post/<id>', methods=['DELETE'])
@token_auth.login_required
def delete_post(id):
    token = g.current_token.get_token()
    try:
        post = Post(db.post.find_one({"_id": ObjectId(id)}))
        if token.id_user != post.created_by:
            abort(405)

        for id_draft in post.edit_history:
            db.draft.delete_one({"_id": id_draft})

        db.post.delete_one({"_id": ObjectId(id)})
        return "ok"
    except:
        abort(403)


@bp.route('/post/<id>/vote/<upordown>', methods=['POST'])
@token_auth.login_required
def vote_post(id, upordown):
    token = g.current_token.get_token()
    vote = 0
    if upordown == "up":
        vote = 1
    elif upordown == "down":
        vote = -1
    elif upordown == "unvote":
        vote = 0
    else:
        abort(403)

    try:
        data = db.post.find_one({"_id": ObjectId(id)}, {"_id": 0, "voted_user." + str(token.id_user): 1, "vote": 1})
        voted = data["voted_user"]
        vote_num = data["vote"]

        if str(token.id_user) in voted:
            rs_vote = vote_num - voted[str(token.id_user)] + vote
        else:
            rs_vote = vote_num + vote

        db.post.update_one({"_id": ObjectId(id)}, {"$set": {"voted_user." + str(token.id_user): vote,
                                                            "vote": rs_vote}})
        return {"vote": rs_vote}
    except:
        abort(403)


@bp.route('/post/<id>/comment', methods=['POST'])
@token_auth.login_required
def post_comment(id):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "content" in rq:
        abort(400)

    cmt = Comment()
    cmt.content = rq["content"]
    cmt.created_by = token.id_user
    try:
        if not "parent" in rq:
            e = db.post.update_one({"_id": ObjectId(id)}, {'$push': {"list_comment": cmt.__dict__}})
        else:
            e = db.post.update_one({"_id": ObjectId(id), "list_comment._id": ObjectId(rq["parent"])},
                                   {'$push': {"list_comment.$.list_comment": cmt.__dict__}})
        if e.matched_count > 0:
            return get_comment(cmt.__dict__)
        else:
            abort(403)
    except:
        abort(403)


@bp.route('/post/<id>/comment', methods=['PUT'])
@token_auth.login_required
def update_comment(id):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "content" in rq or not "id" in rq:
        abort(400)

    try:
        if not "parent" in rq:
            pre_cmt = \
                db.post.find_one({"_id": ObjectId(id)},
                                 {"_id": 0, "list_comment": {"$elemMatch": {"_id": ObjectId(rq['id'])}}})[
                    "list_comment"][0]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"_id": ObjectId(id), "list_comment._id": ObjectId(rq["id"])},
                                   {'$set': {"list_comment.$.content": rq["content"]},
                                    '$push': {"list_comment.$.edit_history": pre_cmt["content"]}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
        else:
            pre_cmt = list(db.post.aggregate([{"$match": {"_id": ObjectId(id)}},
                                              {"$unwind": "$list_comment"},
                                              {"$unwind": "$list_comment.list_comment"},
                                              {"$match": {"list_comment.list_comment._id": ObjectId(rq["id"])}},
                                              {"$project": {"_id": 0, "list_comment.list_comment": 1}}]))[0][
                "list_comment"]["list_comment"]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"_id": ObjectId(id), "list_comment": {"$elemMatch": {
                "_id": ObjectId(rq["parent"]), "list_comment._id": ObjectId(rq["id"])}}},
                                   {"$set": {"list_comment.$[outer].list_comment.$[inner].content": rq["content"]},
                                    "$push": {
                                        "list_comment.$[outer].list_comment.$[inner].edit_history": pre_cmt[
                                            "content"]}},
                                   array_filters=[{"outer._id": ObjectId(rq["parent"])},
                                                  {"inner._id": ObjectId(rq["id"])}])
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
    except:
        abort(403)

    return "ok"


@bp.route('/post/<id>/comment', methods=['DELETE'])
@token_auth.login_required
def delete_comment(id):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "id" in rq:
        abort(400)

    try:
        if not "parent" in rq:
            pre_cmt = \
                db.post.find_one({"_id": ObjectId(id)},
                                 {"_id": 0, "list_comment": {"$elemMatch": {"_id": ObjectId(rq['id'])}}})[
                    "list_comment"][0]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"_id": ObjectId(id)},
                                   {'$pull': {"list_comment": {"_id": ObjectId(rq["id"])}}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
        else:
            pre_cmt = list(db.post.aggregate([{"$match": {"_id": ObjectId(id)}},
                                              {"$unwind": "$list_comment"},
                                              {"$unwind": "$list_comment.list_comment"},
                                              {"$match": {"list_comment.list_comment._id": ObjectId(rq["id"])}},
                                              {"$project": {"_id": 0, "list_comment.list_comment": 1}}]))[0][
                "list_comment"]["list_comment"]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"_id": ObjectId(id), "list_comment._id": ObjectId(rq["parent"])},
                                   {'$pull': {"list_comment.$.list_comment": {"_id": ObjectId(rq["id"])}}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
    except:
        abort(403)


@bp.route('/post/<id>/comment/vote', methods=['POST'])
@token_auth.login_required
def vote_cmt(id):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "id_cmt" in rq or not "upordown" in rq:
        abort(400)

    vote = 0
    if rq["upordown"] == "up":
        vote = 1
    elif rq["upordown"] == "down":
        vote = -1
    elif rq["upordown"] == "unvote":
        vote = 0
    else:
        abort(403)

    try:
        if not "parent" in rq:
            pre_cmt = \
                db.post.find_one({"_id": ObjectId(id)},
                                 {"_id": 0, "list_comment": {"$elemMatch": {"_id": ObjectId(rq['id_cmt'])}}})[
                    "list_comment"][0]
            voted = pre_cmt["voted_user"]
            vote_num = pre_cmt["vote"]

            if str(token.id_user) in voted:
                rs_vote = vote_num - voted[str(token.id_user)] + vote
            else:
                rs_vote = vote_num + vote

            e = db.post.update_one({"_id": ObjectId(id), "list_comment._id": ObjectId(rq["id_cmt"])},
                                   {'$set': {"list_comment.$.voted_user." + str(token.id_user): vote,
                                             "list_comment.$.vote": rs_vote}})
            if e.matched_count > 0:
                return {"vote": rs_vote}
            else:
                abort(403)
        else:
            pre_cmt = list(db.post.aggregate([{"$match": {"_id": ObjectId(id)}},
                                              {"$unwind": "$list_comment"},
                                              {"$unwind": "$list_comment.list_comment"},
                                              {"$match": {"list_comment.list_comment._id": ObjectId(rq["id_cmt"])}},
                                              {"$project": {"_id": 0, "list_comment.list_comment": 1}}]))[0][
                "list_comment"]["list_comment"]
            voted = pre_cmt["voted_user"]
            vote_num = pre_cmt["vote"]

            if str(token.id_user) in voted:
                rs_vote = vote_num - voted[str(token.id_user)] + vote
            else:
                rs_vote = vote_num + vote

            e = db.post.update_one({"_id": ObjectId(id), "list_comment": {"$elemMatch": {
                "_id": ObjectId(rq["parent"]), "list_comment._id": ObjectId(rq["id_cmt"])}}},
                                   {"$set": {"list_comment.$[outer].list_comment.$[inner].voted_user." + str(
                                       token.id_user): vote,
                                             "list_comment.$[outer].list_comment.$[inner].vote": rs_vote}},
                                   array_filters=[{"outer._id": ObjectId(rq["parent"])},
                                                  {"inner._id": ObjectId(rq["id_cmt"])}])
            if e.matched_count > 0:
                return {"vote": rs_vote}
            else:
                abort(403)

    except:
        abort(403)


if __name__ == "__main__":
    post=Post(db.post.find_one({"_id": ObjectId("5fe243e2bc62d295137ead37")}))
    print(post.created_date)
