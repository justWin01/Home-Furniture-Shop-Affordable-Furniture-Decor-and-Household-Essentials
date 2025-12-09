from app.models.user import User
from extensions import db

class UserRepository:

    @staticmethod
    def get_all():
        return User.query.all()

    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def add(user):
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def update():
        db.session.commit()

    @staticmethod
    def delete(user):
        db.session.delete(user)
        db.session.commit()
