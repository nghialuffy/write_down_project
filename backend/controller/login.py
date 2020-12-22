from flask import jsonify, g, abort
from controller import bp
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