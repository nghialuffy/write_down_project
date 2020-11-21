from flask import jsonify, g
from app import bp
from app.auth import basic_auth

@bp.route('/login', methods=['GET'])
@basic_auth.login_required
def login():
    token = g.current_token.get_token()
    return jsonify({'token': token._id})