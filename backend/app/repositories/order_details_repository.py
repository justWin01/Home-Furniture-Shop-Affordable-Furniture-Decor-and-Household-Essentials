from extensions import db
from app.models.order_details import OrderDetails

class OrderDetailsRepository:
    @staticmethod
    def add(detail):
        db.session.add(detail)
        db.session.commit()
        return detail
