from flask import Blueprint, request, jsonify
from app.services.order_details_service import OrderDetailsService
from app.models.orders import Orders

order_details_bp = Blueprint("order_details_bp", __name__)

# GET ALL ORDER DETAILS (with optional customer_id filter)
@order_details_bp.route("/", methods=["GET"])
def get_order_details():
    customer_id = request.args.get('customer_id', type=int)

    if customer_id:
        # Fetch all orders for this customer
        all_details = []
        orders = Orders.query.filter_by(customer_id=customer_id).all()
        for order in orders:
            for detail in order.order_details:
                all_details.append({
                    "order_detail_id": detail.order_detail_id,
                    "order_id": detail.order_id,
                    "product_id": detail.product_id,
                    "quantity": detail.quantity,
                    "subtotal": float(detail.subtotal) if detail.subtotal else 0
                })
        return jsonify(all_details)

    # If no customer_id, return all order details
    details = OrderDetailsService.get_all_order_details()
    return jsonify([{
        "order_detail_id": d.order_detail_id,
        "order_id": d.order_id,
        "product_id": d.product_id,
        "quantity": d.quantity,
        "subtotal": float(d.subtotal) if d.subtotal else 0
    } for d in details])

# GET ORDER DETAIL BY ID
@order_details_bp.route("/<int:id>", methods=["GET"])
def get_order_detail(id):
    d = OrderDetailsService.get_order_detail_by_id(id)
    return jsonify({
        "order_detail_id": d.order_detail_id,
        "order_id": d.order_id,
        "product_id": d.product_id,
        "quantity": d.quantity,
        "subtotal": float(d.subtotal) if d.subtotal else 0
    })

# CREATE ORDER DETAIL
@order_details_bp.route("/", methods=["POST"])
def create_order_detail():
    data = request.get_json()
    OrderDetailsService.create_order_detail(data)
    return jsonify({"message": "Order detail created"}), 201

# UPDATE ORDER DETAIL
@order_details_bp.route("/<int:id>", methods=["PUT"])
def update_order_detail(id):
    data = request.get_json()
    OrderDetailsService.update_order_detail(id, data)
    return jsonify({"message": "Order detail updated"})

# DELETE ORDER DETAIL
@order_details_bp.route("/<int:id>", methods=["DELETE"])
def delete_order_detail(id):
    OrderDetailsService.delete_order_detail(id)
    return jsonify({"message": "Order detail deleted"})
