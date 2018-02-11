from apps.api.models import db

class Task(db.Model):

    __tablename__ = "tasks"

    id = db.Column(db.String(36), primary_key=True)
    parent_id = db.Column(db.String(36))
    text = db.Column(db.String)
    sequence = db.Column(db.Integer)