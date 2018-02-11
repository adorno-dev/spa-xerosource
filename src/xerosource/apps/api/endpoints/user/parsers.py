from flask_restful import reqparse, request, abort

def post_user():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('name', type=str, location='json', required=True)
    parser.add_argument('login', type=str, location='json', required=True)
    parser.add_argument('email', type=str, location='json', required=True)
    parser.add_argument('password', type=str, location='json', required=False)
    parser.add_argument('password_confirm', type=str, location='json', required=False)
    response = parser.parse_args()

    if 'password' in request.json:
        if request.json['password'] != request.json['password_confirm']:
            abort(400, message={ 'password': 'The password and confirmation password do not match' })
    
    return response

def put_user():
    return post_user()