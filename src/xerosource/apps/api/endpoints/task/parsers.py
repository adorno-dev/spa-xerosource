from flask_restful import reqparse

def post_task():
    parser = reqparse.RequestParser()
    parser.add_argument('text', required=True)
    return parser.parse_args()

def put_task():
    return post_task()
