from itsdangerous import SignatureExpired

from flask_restful import request, marshal
from functools import wraps

from apps.api.endpoints.security.fields import login_failure

from apps.api.models.security.user import User

def login_required(f):
    @wraps(f)
    def decorated_endpoint(*args, **kwargs):
        if 'Token' in request.headers:
            token_answer = User.verify_auth_token(request.headers['Token'])
            if type(token_answer) is SignatureExpired:
                return marshal({ 'message': token_answer.message }, login_failure), 401
            return f(*args, **kwargs)
        else:
            return marshal({ 'message': 'Invalid authentication token' }, login_failure), 401
    return decorated_endpoint