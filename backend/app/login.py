from flask import jsonify, g
from app import bp, db
from app.auth import basic_auth
from app.model import Token

@bp.route('/login', methods=['GET'])
@basic_auth.login_required
def login():
    token = Token(g.current_id_user).get_token()
    return jsonify({'token': token._id})