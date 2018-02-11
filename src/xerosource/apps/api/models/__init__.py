from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()
migrate = None

def init_database(app):
    from os import path, environ
    app_dir = path.abspath(path.dirname(__file__))
    app_db_dir = 'sqlite:///{}/{}'
    app.config['SQLALCHEMY_DATABASE_URI'] = app_db_dir.format(app_dir, 'theproject.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    migrate = Migrate(app, db)
    db.init_app(app)