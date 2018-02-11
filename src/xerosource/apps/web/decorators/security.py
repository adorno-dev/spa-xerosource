from flask import request, render_template
from functools import wraps

def token_required(f):
    @wraps(f)
    def token(*args, **kwargs):
        if "Token" not in request.cookies:
            return render_template("index.html", app="login")
        return f(*args, **kwargs)
    return token