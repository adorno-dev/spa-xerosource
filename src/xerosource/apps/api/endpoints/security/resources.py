from flask_restful import Resource

from flask_restful import request, abort

# models
from apps.api.models import db
from apps.api import api

from apps.api.models.models import User, Role, Permission

# resources
from apps.api.endpoints.security.fields import marshal, marshal_with
from apps.api.endpoints.security.fields import login_successfully, login_failure, marshal, marshal_with
from apps.api.endpoints.security.fields import register_successfully
from apps.api.endpoints.security.fields import role_successfully, role_failure
from apps.api.endpoints.security.fields import permission_successfully, permission_failure
from apps.api.endpoints.security.parsers import post_login, put_login
from apps.api.endpoints.security.parsers import post_register, put_register
from apps.api.endpoints.security.parsers import post_role, put_role
from apps.api.endpoints.security.parsers import post_permission, put_permission

# security
from apps.api.endpoints.security import decorators as auth

from datetime import datetime

class LoginEndpoint(Resource):

    def post(self):
        args = post_login()
        try:
            login = db.session.query(User).filter(User.login == args.login).first()
            if login is None:
                return marshal({ 'message': 'Logging failure' }, login_failure), 401
            if login.verify_password(args.password):
                login.token = login.generate_auth_token()
                login.last_seen = datetime.now()
                db.session.commit()
                return marshal({ 'token': login.token, 'expires': login.expires, 'message': 'Logging successfully' }, login_successfully), 200
        except Exception as e:
            return abort(400, message=str(e))
        return marshal({ 'message': 'Logging failure' }, login_failure), 401

class RegisterEndpoint(Resource):

    def post(self):
        args = post_register()
        try:
            register = User(
                name=args.name, 
                login=args.login, 
                email=args.email, 
                password=args.password,
                member_since=datetime.now()
            )
            db.session.add(register)
            db.session.commit()
            return marshal({ 'message': 'Your request has been successfully' }, register_successfully), 200
        except Exception as e:
            return abort(400, message='Your request has been failed')

class RoleEndpoint(Resource):
    
    @auth.login_required
    @marshal_with(role_successfully)
    def get(self):
        return db.session.query(Role).limit(25).all()

    @auth.login_required
    @marshal_with(role_successfully)
    def post(self):
        args = post_role()
        try:
            posted = Role()
            posted.name = args.name
            if 'is_default' in request.json:
                posted.is_default = args.is_default
            else:
                posted.is_default = False
            posted.permissions = args.permissions
            db.session.add(posted)
            db.session.commit()
            return db.session.query(Role).limit(25).all()
        except Exception as e:
            return abort(400, message=str(e))
            # return abort(400, message='Your request has been failed')

class RoleUidEndpoint(Resource):

    @auth.login_required
    @marshal_with(role_successfully)
    def delete(self, id):
        delete_role = db.session.query(Role).get(id)
        db.session.delete(delete_role)
        db.session.commit()
        return db.session.query(Role).limit(25).all()

    @auth.login_required
    @marshal_with(role_successfully)
    def put(self, id):
        args = put_role()
        try:
            update_role = db.session.query(Role).get(id)
            update_role.name = args.name
            if 'is_default' in request.json:
                update_role.is_default = args.is_default
            else:
                update_role.is_default = False
            update_role.permissions = args.permissions
            db.session.commit()
            return db.session.query(Role).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')

class PermissionEndpoint(Resource):
    
    @auth.login_required
    @marshal_with(permission_successfully)
    def get(self):
        return db.session.query(Permission).limit(25).all()

    @auth.login_required
    @marshal_with(permission_successfully)
    def post(self):
        args = post_permission()
        try:
            posted = Permission()
            posted.name = args.name
            posted.value = args.value
            db.session.add(posted)
            db.session.commit()
            return db.session.query(Permission).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')

class PermissionUidEndpoint(Resource):
    
    @auth.login_required
    @marshal_with(permission_successfully)
    def delete(self, id):
        deleted = db.session.query(Permission).get(id)
        db.session.delete(deleted)
        db.session.commit()
        return db.session.query(Permission).limit(25).all()

    @auth.login_required
    @marshal_with(permission_successfully)
    def put(self, id):
        args = post_permission()
        try:
            puted = db.session.query(Permission).get(id)
            puted.name = args.name
            puted.permissions = args.value
            db.session.commit()
            return db.session.query(Permission).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')