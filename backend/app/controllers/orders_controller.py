from flask import Blueprint, request, jsonify
from app.services.orders_service import OrdersService

orders_bp = Blueprint("orders_bp", __name__)

# GET ALL ORDERS
@orders_bp.route("/", methods=["GET"])
def get_orders():
    orders = OrdersService.get_all_orders()
    return jsonify([{
        "order_id": o.order_id,
        "user_id": o.customer_id,
        "status": o.status
    } for o in orders])

# GET ORDER BY ID
@orders_bp.route("/<int:order_id>", methods=["GET"])
def get_order(order_id):
    o = OrdersService.get_order_by_id(order_id)
    return jsonify({
        "order_id": o.order_id,
        "user_id": o.customer_id,
        "status": o.status
    })

# CREATE ORDER
@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.get_json()
    OrdersService.create_order(data)
    return jsonify({"message": "Order created"}), 201

# UPDATE ORDER
@orders_bp.route("/<int:order_id>", methods=["PUT"])
def update_order(order_id):
    data = request.get_json()
    OrdersService.update_order(order_id, data)
    return jsonify({"message": "Order updated"})

# DELETE ORDER
@orders_bp.route("/<int:order_id>", methods=["DELETE"])
def delete_order(order_id):
    OrdersService.delete_order(order_id)
    return jsonify({"message": "Order deleted"})
