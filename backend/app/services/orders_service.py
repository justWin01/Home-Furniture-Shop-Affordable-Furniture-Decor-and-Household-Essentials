from extensions import db
from app.models.orders import Orders

class OrdersService:
    
    # GET ALL ORDERS
    @staticmethod
    def get_all_orders():
        return Orders.query.all()

    # GET ORDER BY ID
    @staticmethod
    def get_order_by_id(order_id):
        return Orders.query.get_or_404(order_id)

    # CREATE ORDER
    @staticmethod
    def create_order(data):
        order = Orders(
            user_id=data["user_id"],
            status=data.get("status", "Pending")
        )
        db.session.add(order)
        db.session.commit()
        return order

    # UPDATE ORDER
    @staticmethod
    def update_order(order_id, data):
        order = Orders.query.get_or_404(order_id)
        order.status = data.get("status", order.status)
        db.session.commit()
        return order

    # DELETE ORDER
    @staticmethod
    def delete_order(order_id):
        order = Orders.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return True
