from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import SignatureExpired
from flask_login import UserMixin

from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

from apps.api.models import db
from apps.api import app

class User(UserMixin, db.Model):
    
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), unique=False)
    login = db.Column(db.String(64), unique=True)
    email = db.Column(db.String(128), unique=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    token = db.Column(db.String(255))
    member_since = db.Column(db.DateTime)
    last_seen = db.Column(db.DateTime)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute!')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    # token expires in 30 minutes
    def generate_auth_token(self, expiration=1800):
        serializer = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        expires = datetime.utcnow() + timedelta(seconds=expiration)
        self.expires = expires.strftime("%a, %d %b %Y %H:%M:%S GMT")
        return serializer.dumps({ 'id': self.id, 'expires': self.expires }).decode('ascii')

    @staticmethod
    def read_password(password):
        return generate_password_hash(password)

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired as e:
            return e
        return User.query.get(data['id'])

    def __repr__(self):
        return '<user %r>' % self.login