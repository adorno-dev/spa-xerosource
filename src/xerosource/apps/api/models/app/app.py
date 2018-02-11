from apps.api.models import db

class App(db.Model):

    __tablename__ = "apps"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    public_key = db.Column(db.String, unique=True)
    created_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=False)