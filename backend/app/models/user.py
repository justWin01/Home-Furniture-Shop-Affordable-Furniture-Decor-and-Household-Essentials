from datetime import datetime
from extensions import db

class User(db.Model):
    __tablename__ = 'users' 

    # USER MODEL FIELDS
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    contact_number = db.Column(db.String(20))
    address = db.Column(db.Text)
    role = db.Column(db.Enum('Admin', 'Customer', name='user_roles'), default='Customer', nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)

    # RELATIONSHIPS
    orders = db.relationship('Orders', backref='customer', lazy=True)

    # STRING REPRESENTATION
    def __repr__(self):
        return f"<User {self.full_name}>"
    
    # CONVERT TO DICTIONARY
    def to_dict(self):
        return {
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "contact_number": self.contact_number,
            "address": self.address,
            "role": self.role,
            "date_joined": self.date_joined.isoformat() if self.date_joined else None
        }
