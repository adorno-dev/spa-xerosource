from flask_restful import marshal_with, fields

all_tasks = {
    'id': fields.String,
    'parent_id': fields.String,
    'text': fields.String,
    'sequence': fields.Integer
}