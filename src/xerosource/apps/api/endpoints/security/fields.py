from flask_restful import marshal, marshal_with, fields

login_successfully = {
    'token': fields.String,
    'expires': fields.String,
    'message': fields.String
}

login_failure = {
    'message': fields.String
}

register_successfully = {
    'message': fields.String
}

role_successfully = {
    'id': fields.Integer,
    'name': fields.String,
    'is_default': fields.Boolean,
    'permissions': fields.String
}

role_failure = {
    'message': fields.String
}

permission_successfully = {
    'id': fields.Integer,
    'name': fields.String,
    'value': fields.String
}

permission_failure = {
    'message': fields.String
}