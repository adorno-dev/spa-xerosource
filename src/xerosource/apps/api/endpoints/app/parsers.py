from flask_restful import reqparse

def post_app():
    parser = reqparse.RequestParser()
    parser.add_argument('name', type=str, required=True)
    parser.add_argument('public_key', type=str, required=True)
    parser.add_argument('is_active', type=bool, default=False, required=False)
    return parser.parse_args()

def put_app():
    return post_app()