from flask import request, abort, g
from controller import bp, db
from controller.model import Draft, get_url_post
from controller.auth import token_auth

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
        return draft.url_draft
    except:
        abort(403)

@bp.route('/draft/<draftname>', methods=['GET'])
@token_auth.login_required
def get_draft(draftname):
    try:
        data = db.draft.find_one({"url_draft": draftname}, {"_id": 0, "url_draft": 0})

        token = g.current_token.get_token()
        if token.id_user != data["created_by"]:
            abort(405)

        draft = {"title": data["title"], "content": data["content"], "created_date": data["created_date"],
                 "list_hashtag": data["list_hashtag"],
                 "category": db.category.find_one({"_id": data["category"]}, {"_id": 0, "name_category": 1, "url": 1})}

        return draft
    except:
        abort(403)

@bp.route('/draft/<draftname>', methods=['PUT'])
@token_auth.login_required
def put_draft(draftname):
    token = g.current_token.get_token()

    pre_draft = Draft(db.draft.find_one({"url_draft": draftname}))
    if token.id_user != pre_draft.created_by:
        abort(405)

    rq = request.json
    if not rq or not "title" in rq or not "content" in rq or not "list_hashtag" in rq or not "category" in rq:
        abort(400)

    try:
        category_id = db.category.find_one({"url": rq["category"]}, {"_id": 1})["_id"]

        if pre_draft.title == rq["title"] and pre_draft.content == rq["content"] and pre_draft.list_hashtag == rq[
            "list_hashtag"] and pre_draft.category == category_id:
            return draftname

        db.draft.update_one({"url_draft": draftname},
                           {"$set": {
                                   "title": rq["title"],
                                   "content": rq["content"],
                                   "list_hashtag": rq["list_hashtag"],
                                   "category": category_id
                                    }})
    except:
        abort(403)
    return draftname

@bp.route('/draft/<draftname>', methods=['DELETE'])
@token_auth.login_required
def delete_draft(draftname):
    token = g.current_token.get_token()
    try:
        draft = Draft(db.draft.find_one({"url_draft": draftname}))
        if token.id_user != draft.created_by:
            abort(405)

        db.user.update_one({"_id": token.id_user}, {"$pull": {"list_draft": draft._id}})
        db.draft.delete_one({"url_draft": draftname})
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

@bp.route('/draft/<draftname>/post', methods=['POST'])
@token_auth.login_required
def draft_to_post(draftname):
    try:
        draft = Draft(db.draft.find_one({"url_draft": draftname}))

        token = g.current_token.get_token()
        if token.id_user != draft.created_by:
            abort(405)

        post=draft.toPost()
        post.insert_to_db()

        return post.url_post
    except:
        abort(403)