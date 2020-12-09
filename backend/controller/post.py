from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read, Comment
from datetime import datetime
from controller.auth import token_auth
from bson.objectid import ObjectId


def get_comment(data_cmt, is_reply=False):
    cmt = {"_id": str(data_cmt["_id"]), "content": data_cmt["content"], "created_date": data_cmt["created_date"],
           "vote": data_cmt["vote"],
           "created_by": db.user.find_one({"_id": data_cmt["created_by"]}, {"_id": 0, "username": 1, "display_name": 1,
                                                                            "avatar": 1})}
    if not is_reply:
        cmt["list_comment"] = []
        for data_reply in data_cmt["list_comment"]:
            cmt["list_comment"].append(get_comment(data_reply, True))
    return cmt


@bp.route('/post/<postname>', methods=['GET'])
def get_post(postname):
    post = {}
    data = db.post.find_one({"url_post": postname}, {"_id": 0, "url_post": 0, "time_to_read": 0})
    post["title"] = data["title"]
    post["content"] = data["content"]
    post["created_date"] = data["created_date"]
    post["list_hashtag"] = data["list_hashtag"]
    post["vote"] = data["vote"]
    post["views"] = data["views"]
    post["edit_history"] = len(data["edit_history"]) > 0
    post["category"] = db.category.find_one({"_id": data["category"]}, {"_id": 0, "name_category": 1, "url": 1})
    post["created_by"] = db.user.find_one({"_id": data["created_by"]}, {"_id": 0, "username": 1, "display_name": 1,
                                                                        "avatar": 1})
    post["list_comment"] = []
    for data_cmt in data["list_comment"]:
        post["list_comment"].append(get_comment(data_cmt))
    return post


@bp.route('/post/<postname>/edit-history', methods=['GET'])
def get_post_edit_history(postname):
    try:
        edit_history = db.post.find_one({"url_post": postname}, {"_id": 0, "edit_history": 1})["edit_history"]
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

    try:
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
        return post.url_post
    except:
        abort(403)


@bp.route('/post/<postname>', methods=['PUT'])
@token_auth.login_required
def put_post(postname):
    token = g.current_token.get_token()

    pre_post = Post(db.post.find_one({"url_post": postname}))
    if token.id_user != pre_post.created_by:
        abort(405)

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    try:
        category_id = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]

        if pre_post.title == rq["title"] and pre_post.content == rq["content"] and pre_post.list_hashtag == rq[
            "list_hashtag"] and pre_post.category == category_id:
            return postname
        draft_hictory = pre_post.toDraft()
        draft_hictory.insert_to_db()

        db.post.update_one({"url_post": postname},
                           {
                               "$set": {
                                   "title": rq["title"],
                                   "content": rq["content"],
                                   "list_hashtag": rq["list_hashtag"],
                                   "category": db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"],
                                   "time_to_read": get_time_to_read(rq["content"])
                               },
                               "$push": {
                                   "edit_history": draft_hictory._id
                               }
                           })
    except:
        abort(403)
    return postname


@bp.route('/post/<postname>', methods=['DELETE'])
@token_auth.login_required
def delete_post(postname):
    token = g.current_token.get_token()
    try:
        post = Post(db.post.find_one({"url_post": postname}))
        if token.id_user != post.created_by:
            abort(405)

        for id_draft in post.edit_history:
            db.draft.delete_one({"_id": id_draft})

        db.post.delete_one({"url_post": postname})
        return "ok"
    except:
        abort(403)


@bp.route('/post/<postname>/comment', methods=['POST'])
@token_auth.login_required
def post_comment(postname):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "content" in rq:
        abort(400)

    cmt = Comment()
    cmt.content = rq["content"]
    cmt.created_by = token.id_user
    try:
        if not "parent" in rq:
            db.post.update_one({"url_post": postname}, {'$push': {"list_comment": cmt.__dict__}})
        else:
            db.post.update_one({"url_post": postname, "list_comment._id": ObjectId(rq["parent"])},
                               {'$push': {"list_comment.$.list_comment": cmt.__dict__}})
    except:
        abort(403)

    return get_comment(cmt.__dict__)


@bp.route('/post/<postname>/comment', methods=['PUT'])
@token_auth.login_required
def update_comment(postname):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "content" in rq or not "id" in rq:
        abort(400)

    try:
        if not "parent" in rq:
            pre_cmt = \
                db.post.find_one({"url_post": postname},
                                 {"_id": 0, "list_comment": {"$elemMatch": {"_id": ObjectId(rq['id'])}}})[
                    "list_comment"][0]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"url_post": postname, "list_comment._id": ObjectId(rq["id"])},
                                   {'$set': {"list_comment.$.content": rq["content"]},
                                    '$push': {"list_comment.$.edit_history": pre_cmt["content"]}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
        else:
            pre_cmt = list(db.post.aggregate([{"$match": {"url_post": postname}},
                                              {"$unwind": "$list_comment"},
                                              {"$unwind": "$list_comment.list_comment"},
                                              {"$match": {"list_comment.list_comment._id": ObjectId(rq["id"])}},
                                              {"$project": {"_id": 0, "list_comment.list_comment": 1}}]))[0][
                "list_comment"]["list_comment"]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e = db.post.update_one({"url_post": postname, "list_comment": {"$elemMatch": {
                "_id": ObjectId(rq["parent"]), "list_comment._id": ObjectId(rq["id"])}}},
                                   {"$set": {"list_comment.$[outer].list_comment.$[inner].content": rq["content"]},
                                    "$push": {
                                        "list_comment.$[outer].list_comment.$[inner].edit_history": pre_cmt["content"]}},
                                   array_filters=[{"outer._id": ObjectId(rq["parent"])}, {"inner._id": ObjectId(rq["id"])}])
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
    except:
        abort(403)

    return "ok"


@bp.route('/post/<postname>/comment', methods=['DELETE'])
@token_auth.login_required
def delete_comment(postname):
    token = g.current_token.get_token()
    rq = request.json

    if not rq or not "id" in rq:
        abort(400)

    try:
        if not "parent" in rq:
            pre_cmt = \
                db.post.find_one({"url_post": postname},
                                 {"_id": 0, "list_comment": {"$elemMatch": {"_id": ObjectId(rq['id'])}}})[
                    "list_comment"][0]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e=db.post.update_one({"url_post": postname},
                               {'$pull': {"list_comment": {"_id": ObjectId(rq["id"])}}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
        else:
            pre_cmt = list(db.post.aggregate([{"$match": {"url_post": postname}},
                                              {"$unwind": "$list_comment"},
                                              {"$unwind": "$list_comment.list_comment"},
                                              {"$match": {"list_comment.list_comment._id": ObjectId(rq["id"])}},
                                              {"$project": {"_id": 0, "list_comment.list_comment": 1}}]))[0][
                "list_comment"]["list_comment"]
            if token.id_user != pre_cmt["created_by"]:
                abort(405)
            e=db.post.update_one({"url_post": postname, "list_comment._id": ObjectId(rq["parent"])},
                               {'$pull': {"list_comment.$.list_comment": {"_id": ObjectId(rq["id"])}}})
            if e.matched_count > 0:
                return "ok"
            else:
                abort(403)
    except:
        abort(403)


if __name__ == "__main__":
    print(list(db.post.aggregate([
        {
            "$match": {
                "url_post": "asdgasfg"
            }
        },
        {
            "$unwind": "$list_comment"
        },
        {
            "$unwind": "$list_comment.list_comment"
        },
        {
            "$match": {
                "list_comment.list_comment._id": ObjectId("5fd060e41a2fcfffa843087e")
            }
        },
        {
            "$project": {
                "_id": 0,
                "list_comment.list_comment": 1
            }
        }
    ]))[0]["list_comment"]["list_comment"])
