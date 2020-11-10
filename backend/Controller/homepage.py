from flask_restful import Resource
from core import *

class HomePage(Resource):
    def post(self):
        try:
            token = request.headers['Authorization']
            status, msg = VerifyToken(token)
            if status:
                return format_reponse(status.HTTP_200_OK, 'REQUEST_SUCCESS', None, None)
            else:
                return format_reponse(401, msg, None, msg), status.HTTP_401_UNAUTHORIZED
        except Exception as e:
            print(e)
            return format_reponse(6, 'Internal Server Error', None, 'Internal Server Error'), status.HTTP_500_INTERNAL_SERVER_ERROR