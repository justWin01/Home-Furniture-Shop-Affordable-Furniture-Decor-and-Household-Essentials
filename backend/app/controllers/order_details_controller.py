from flask import Blueprint, request, jsonify
from app.models.orders import Orders
from app.models.order_details import OrderDetails
from app.models.product import Product

order_details_bp = Blueprint("order_details_bp", __name__)

@order_details_bp.route("/", methods=["GET"])
def get_order_details():
    customer_id = request.args.get("customer_id", type=int)
    all_details = []

    try:
        if customer_id:
            orders = Orders.query.filter_by(customer_id=customer_id).all()
            for order in orders:
                for detail in order.order_details:
                    product = Product.query.get(detail.product_id)
                    all_details.append({
                        "order_detail_id": detail.order_detail_id,
                        "order_id": detail.order_id,
                        "product_id": detail.product_id,
                        "product_name": product.name if product else "Unknown Product",
                        "product_image": product.image if product else None,
                        "quantity": detail.quantity,
                        "subtotal": float(detail.subtotal) if detail.subtotal else 0,
                        "status": order.status or "Pending",
                        "order_date": order.order_date.isoformat() if order.order_date else None
                    })
        else:
            details = OrderDetails.query.all()
            for detail in details:
                product = Product.query.get(detail.product_id)
                all_details.append({
                    "order_detail_id": detail.order_detail_id,
                    "order_id": detail.order_id,
                    "product_id": detail.product_id,
                    "product_name": product.name if product else "Unknown Product",
                    "product_image": product.image if product else None,
                    "quantity": detail.quantity,
                    "subtotal": float(detail.subtotal) if detail.subtotal else 0
                })

        return jsonify(all_details), 200

    except Exception as e:
        print("Error fetching order details:", e)
        return jsonify({"message": "Server error"}), 500
