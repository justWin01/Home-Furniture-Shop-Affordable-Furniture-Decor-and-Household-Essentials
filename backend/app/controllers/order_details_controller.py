from flask import Blueprint, request, jsonify
from app.services.order_details_service import OrderDetailsService

order_details_bp = Blueprint("order_details_bp", __name__)

# GET ALL ORDER DETAILS
@order_details_bp.route("/", methods=["GET"])
def get_order_details():
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
