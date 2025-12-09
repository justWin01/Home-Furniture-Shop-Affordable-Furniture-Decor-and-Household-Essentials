from extensions import db
from app.models.order_details import OrderDetails

class OrderDetailsService:

    # GET ALL ORDER DETAILS
    @staticmethod
    def get_all_order_details():
        return OrderDetails.query.all()

    # GET ORDER DETAIL BY ID
    @staticmethod
    def get_order_detail_by_id(order_details_id):
        return OrderDetails.query.get_or_404(order_details_id)

    # CREATE ORDER DETAIL
    @staticmethod
    def create_order_detail(data):
        detail = OrderDetails(
            order_id=data["order_id"],
            product_id=data["product_id"],
            quantity=data["quantity"],
            price=data["price"]
        )
        db.session.add(detail)
        db.session.commit()
        return detail

    # UPDATE ORDER DETAIL
    @staticmethod
    def update_order_detail(order_details_id, data):
        detail = OrderDetails.query.get_or_404(order_details_id)
        detail.quantity = data.get("quantity", detail.quantity)
        detail.price = data.get("price", detail.price)
        db.session.commit()
        return detail

    # DELETE ORDER DETAIL
    @staticmethod
    def delete_order_detail(order_details_id):
        detail = OrderDetails.query.get_or_404(order_details_id)
        db.session.delete(detail)
        db.session.commit()
        return True
