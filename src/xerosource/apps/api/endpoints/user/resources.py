from flask_restful import Resource, request, abort

from datetime import datetime

# models
from apps.api.models import db
from apps.api.models.models import User

# resources
from apps.api.endpoints.user.fields import get_successsfuly, post_successfully, marshal_with
from apps.api.endpoints.user.parsers import post_user, put_user

# security
from apps.api.endpoints.security import decorators as auth

class UserEndpoint(Resource):

    @auth.login_required
    @marshal_with(get_successsfuly)
    def get(self):
        db.create_all()
        return db.session.query(User).limit(25).all()

    @auth.login_required
    @marshal_with(get_successsfuly)
    def post(self):
        args = post_user()  
        try:
            posted = User(
                name=args.name, 
                login=args.login, 
                email=args.email, 
                password=args.password,
                member_since=datetime.now()
            )
            db.session.add(posted)
            db.session.commit() 
            return db.session.query(User).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')

class UserUidEndpoint(Resource):

    @auth.login_required
    @marshal_with(get_successsfuly)
    def delete(self, id):
        delete_user = db.session.query(User).get(id)
        db.session.delete(delete_user)
        db.session.commit()
        return db.session.query(User).limit(25).all()

    @auth.login_required
    @marshal_with(get_successsfuly)
    def put(self, id):
        try:
            args = put_user()
            update_user = db.session.query(User).get(id)
            update_user.name = args.name
            update_user.login = args.login
            update_user.email = args.email
            if 'password' in request.json:
                update_user.password = args.password
            db.session.commit()
            return db.session.query(User).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')