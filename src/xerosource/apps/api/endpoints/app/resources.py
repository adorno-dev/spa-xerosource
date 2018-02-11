from flask_restful import Resource

from flask_restful import request, abort
from datetime import datetime

# models
from apps.api.models import db
from apps.api.models.models import App

# resources
from apps.api.endpoints.app.fields import all_apps, marshal_with
from apps.api.endpoints.app.parsers import post_app, put_app

# security
from apps.api.endpoints.security import decorators as auth

class AppEndpoint(Resource):

    @auth.login_required
    @marshal_with(all_apps)
    def get(self):
        return db.session.query(App).limit(25).all()

    @auth.login_required
    @marshal_with(all_apps)
    def post(self):
        args = post_app()
        try:
            posted = App()
            posted.name = args.name
            posted.public_key = args.public_key
            if 'is_active' in request.json:
                posted.is_active = args.is_active
            else:
                posted.is_active = False
            posted.created_at = datetime.now()
            db.session.add(posted)
            db.session.commit()
            return db.session.query(App).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')

class AppUidEndpoint(Resource):

    @auth.login_required
    @marshal_with(all_apps)
    def get(self, id):
        return db.session.query(App).get(id)

    @auth.login_required
    @marshal_with(all_apps)
    def delete(self, id):
        delete_app = db.session.query(App).get(id)
        db.session.delete(delete_app)
        db.session.commit()
        return db.session.query(App).limit(25).all()

    @auth.login_required
    @marshal_with(all_apps)
    def put(self, id):
        try:
            args = put_app()
            update_app = db.session.query(App).get(id)
            update_app.name = args.name
            update_app.public_key = args.public_key
            if 'is_active' in request.json:
                update_app.is_active = args.is_active
            else:
                update_app.is_active = False
            db.session.commit()
            return db.session.query(App).limit(25).all()
        except Exception as e:
            return abort(400, message='Your request has been failed')