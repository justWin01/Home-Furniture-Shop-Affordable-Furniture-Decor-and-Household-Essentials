from datetime import datetime
from extensions import db

class Orders(db.Model):
    __tablename__ = 'orders'

    # ORDER MODEL FIELDS
    order_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    total_amount = db.Column(db.Numeric(10,2), default=0.00)
    status = db.Column(
        db.Enum('Pending', 'Shipped', 'Completed', 'Cancelled', name='order_status'),
        default='Pending'
    )

    # RELATIONSHIPS
    order_details = db.relationship('OrderDetails', backref='order', lazy=True)

    # STRING REPRESENTATION
    def __repr__(self):
        return f"<Order {self.order_id}>"

    # CONVERT TO DICTIONARY
    def to_dict(self):
        return {
            "order_id": self.order_id,
            "customer_id": self.customer_id,
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "total_amount": float(self.total_amount),
            "status": self.status
        }
