from flask import jsonify, g
from controller import bp
from controller.auth import basic_auth

@bp.route('/login', methods=['GET'])
@basic_auth.login_required
def login():
    token = g.current_token.get_token()
    return jsonify({'token': token._id})