from flask_restful import Api
from flask import Flask

from flask import make_response

app = Flask(__name__)
api = Api(app=app)

from apps.api.models import db, init_database
from apps.api.endpoints import Login, Register
from apps.api.endpoints import Role, RoleUid
from apps.api.endpoints import Task, TaskUid
from apps.api.endpoints import User, UserUid
from apps.api.endpoints import Permission, PermissionUid
from apps.api.endpoints import App, AppUid

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5000')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Token')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Content-Type', 'application/json; charset=UTF-8')
    return response

@app.before_first_request
def on_init_api():
    db.create_all()

def init_api():
    init_database(app)
    api.add_resource(Login, '/login')
    api.add_resource(Register, '/register')
    api.add_resource(Role, '/roles')
    api.add_resource(RoleUid, '/roles/<int:id>')
    api.add_resource(Permission, '/permissions')
    api.add_resource(PermissionUid, '/permissions/<int:id>')
    api.add_resource(Task, '/tasks')
    api.add_resource(TaskUid, '/tasks/<string:id>')
    api.add_resource(User, '/users')
    api.add_resource(UserUid, '/users/<int:id>')
    api.add_resource(App, '/apps')
    api.add_resource(AppUid, '/apps/<int:id>')
    app.config['SECRET_KEY'] = 'h4rd t0 gu3ss 5tr1ng'
    app.config['BUNDLE_ERRORS'] = True

init_api()