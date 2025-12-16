from extensions import db
from app.models.user import User
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
        customer_id = data.get("customer_id")
        total_amount = data.get("total_amount", 0.0)
        status = data.get("status", "Pending")

        # Check if the customer exists
        customer = User.query.get(customer_id)
        if not customer:
            raise ValueError(f"Customer with id {customer_id} does not exist.")

        # Create the order
        new_order = Orders(customer_id=customer_id, total_amount=total_amount, status=status)
        db.session.add(new_order)
        db.session.commit()
        return new_order

    # UPDATE ORDER
    @staticmethod
    def update_order(order_id, data):
        order = Orders.query.get_or_404(order_id)
        order.status = data.get("status", order.status)
        order.total_amount = data.get("total_amount", order.total_amount)
        db.session.commit()
        return order

    # DELETE ORDER
    @staticmethod
    def delete_order(order_id):
        order = Orders.query.get_or_404(order_id)
        db.session.delete(order)
        db.session.commit()
        return True
