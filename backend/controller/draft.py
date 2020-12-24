from flask import request, abort, g
from controller import bp, db
from controller.model import Draft, get_url_post
from controller.auth import token_auth
from bson.objectid import ObjectId

@bp.route('/draft', methods=['POST'])
@token_auth.login_required
def post_draft():
    token = g.current_token.get_token()

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    try:
        draft = Draft()
        draft.title = rq["title"]
        draft.content = rq["content"]
        draft.list_hashtag = rq["list_hashtag"]
        draft.category = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]
        draft.created_by = token.id_user
        draft.url_draft = get_url_post(draft.title, draft=True)

        draft.insert_to_db()
        return str(draft._id)
    except:
        abort(403)

@bp.route('/draft/<id>', methods=['GET'])
@token_auth.login_required
def get_draft(id):
    try:
        data = db.draft.find_one({"_id": ObjectId(id)}, {"_id": 0, "url_draft": 0})

        token = g.current_token.get_token()
        if token.id_user != data["created_by"]:
            abort(405)

        category=db.category.find_one({"_id": data["category"]}, {"_id": 1, "name_category": 1, "url": 1})

        draft = {"title": data["title"], "content": data["content"], "created_date": data["created_date"],
                 "list_hashtag": data["list_hashtag"],
                 "category": {"_id": str(category["_id"]), "name_category": category["name_category"],
                          "url": category["url"]}}

        return draft
    except:
        abort(403)

@bp.route('/draft/<id>', methods=['PUT'])
@token_auth.login_required
def put_draft(id):
    token = g.current_token.get_token()

    pre_draft = Draft(db.draft.find_one({"_id": ObjectId(id)}))
    if token.id_user != pre_draft.created_by:
        abort(405)

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    try:
        category_id = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]

        if pre_draft.title == rq["title"] and pre_draft.content == rq["content"] and pre_draft.list_hashtag == rq[
            "list_hashtag"] and pre_draft.category == category_id:
            return id

        db.draft.update_one({"_id": ObjectId(id)},
                           {"$set": {
                                   "title": rq["title"],
                                   "content": rq["content"],
                                   "list_hashtag": rq["list_hashtag"],
                                   "category": category_id
                                    }})
    except:
        abort(403)
    return id

@bp.route('/draft/<id>', methods=['DELETE'])
@token_auth.login_required
def delete_draft(id):
    token = g.current_token.get_token()
    try:
        draft = Draft(db.draft.find_one({"_id": ObjectId(id)}))
        if token.id_user != draft.created_by:
            abort(405)

        db.user.update_one({"_id": token.id_user}, {"$pull": {"list_draft": draft._id}})
        db.draft.delete_one({"_id": ObjectId(id)})
        return "ok"
    except:
        abort(403)

@bp.route('/draft', methods=['GET'])
@token_auth.login_required
def get_all_draft():
    token = g.current_token.get_token()
    try:
        list_id_draft=db.user.find_one({"_id": token.id_user}, {"_id": 0, "list_draft": 1})["list_draft"]

        list_draft=[]
        for id_draft in list_id_draft:
            draft=Draft(db.draft.find_one({"_id": id_draft}))
            list_draft.append(draft.get_mini_draft())

        return {"list_draft": list_draft}
    except:
        abort(403)

@bp.route('/draft/<id>/post', methods=['POST'])
@token_auth.login_required
def draft_to_post(id):
    try:
        draft = Draft(db.draft.find_one({"_id": ObjectId(id)}))

        token = g.current_token.get_token()
        if token.id_user != draft.created_by:
            abort(405)

        post=draft.toPost()
        post.insert_to_db()

        return str(post._id)
    except:
        abort(403)