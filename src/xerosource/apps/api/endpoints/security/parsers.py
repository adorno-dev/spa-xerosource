from flask_restful import reqparse, request, abort

# login

def post_login():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('login', type=str, required=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('next', type=str, required=False)
    return parser.parse_args()

def put_login():
    return post_login()

# register

def post_register():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('name', type=str, location='json', required=True)
    parser.add_argument('login', type=str, location='json', required=True)
    parser.add_argument('email', type=str, location='json', required=True)
    parser.add_argument('password', type=str, location='json', required=True)
    parser.add_argument('password_confirm', type=str, location='json', required=True)
    response = parser.parse_args()

    if request.json['password'] != request.json['password_confirm']:
        abort(400, message={ 'password': 'The password and confirmation password do not match' })

    return response

def put_register():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('login', type=str, required=True)
    parser.add_argument('email', type=str, required=True)
    parser.add_argument('password', type=str, required=True)
    parser.add_argument('password_confirm', type=str, required=True)
    return parser.parse_args()

# role

def post_role():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('is_default', type=bool, required=False)
    parser.add_argument('permissions', type=str, required=True)
    return parser.parse_args()

def put_role():
    return post_role()

# permission

def post_permission():
    parser = reqparse.RequestParser(bundle_errors=True)
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('value', type=str, required=True)
    return parser.parse_args()

def put_permission():
    return post_permission()
