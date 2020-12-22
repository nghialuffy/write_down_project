from flask import jsonify, g, abort
from controller import bp,db
from controller.auth import basic_auth, token_auth

@bp.route('/login', methods=['POST'])
@basic_auth.login_required
def login():
    token = g.current_token.get_token()
    return jsonify({'token': token._id})

@bp.route('/logout', methods=['DELETE'])
@token_auth.login_required
def logout():
    token = g.current_token.get_token()
    if token.revoke_token()=="ok":
        return "ok"
    else:
        abort(403)

@bp.route('/auth', methods=['GET'])
@token_auth.login_required
def auth():
    token = g.current_token.get_token()
    try:
        user=db.user.find_one({"_id": token.id_user}, {"_id": 1, "username": 1, "display_name": 1, "avatar": 1})
        return {"_id": str(user["_id"]), "username": user["username"], "display_name": user["display_name"],
                "avatar": user["avatar"]}
    except:
        abort(403)