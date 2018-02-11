from flask_restful import marshal_with, fields

all_apps = {
    'id': fields.Integer,
    'name': fields.String,
    'public_key': fields.String,
    'created_at': fields.DateTime,
    'is_active': fields.Boolean
}