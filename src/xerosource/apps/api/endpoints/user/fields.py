from flask_restful import marshal_with, fields

get_successsfuly = {
    'id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'login': fields.String,
    'member_since': fields.DateTime,
    'last_seen': fields.DateTime
}

post_successfully = {
    'message': fields.String
}