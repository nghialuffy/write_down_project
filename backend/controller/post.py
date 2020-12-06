from flask import request, abort, g
from controller import bp, db
from controller.model import Post, get_url_post, get_time_to_read
from datetime import datetime
from controller.auth import token_auth


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
    post["edit_history"]=len(data["edit_history"])>0
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
        list_history=[]
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
        category_id=db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]

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
            abort(402)

        for id_draft in post.edit_history:
            db.draft.delete_one({"_id": id_draft})

        db.post.delete_one({"url_post": postname})
        return "ok"
    except:
        abort(403)

if __name__ == "__main__":
    print("")
