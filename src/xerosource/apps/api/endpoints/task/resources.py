from flask_restful import Resource

# models
from apps.api.models import db
from apps.api.models.models import Task

# resources
from apps.api.endpoints.task.fields import all_tasks, marshal_with
from apps.api.endpoints.task.parsers import post_task, put_task

# security
from apps.api.endpoints.security import decorators as auth

class TaskEndpoint(Resource):

    @auth.login_required
    @marshal_with(all_tasks)
    def get(self):
        return db.session.query(Task).limit(25).all()

    @auth.login_required
    def post(self):
        from uuid import uuid4
        args = post_task()
        new_task = Task()
        new_task.id = str(uuid4())
        new_task.text = args.get('text')
        new_task.sequence = 1
        db.session.add(new_task)
        db.session.commit()
        return self.get()

class TaskUidEndpoint(Resource):

    @marshal_with(all_tasks)
    def get(self, id):
        return db.session.query(Task).get(id)

    @marshal_with(all_tasks)
    def put(self, id):
        args = put_task()
        update_task = db.session.query(Task).get(id)
        update_task.text = args.get('text')
        db.session.commit()
        return db.session.query(Task).limit(25).all()

    @marshal_with(all_tasks)
    def delete(self, id):
        delete_task = db.session.query(Task).get(id)
        db.session.delete(delete_task)
        db.session.commit()
        return db.session.query(Task).limit(25).all()