from apps.api.models import db

class Permission(db.Model):

    __tablename__ = "permissions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    value = db.Column(db.String(16), unique=True, index=True)