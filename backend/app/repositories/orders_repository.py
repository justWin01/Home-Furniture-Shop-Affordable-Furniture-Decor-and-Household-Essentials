from extensions import db
from app.models.orders import Orders

class OrdersRepository:
    @staticmethod
    def add(order):
        db.session.add(order)
        db.session.commit()
        return order

    @staticmethod
    def get_by_id(order_id):
        return Orders.query.get(order_id)
