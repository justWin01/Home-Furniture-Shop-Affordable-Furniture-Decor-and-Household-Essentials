from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from app.services.product_service import ProductService

product_bp = Blueprint("product_bp", __name__)


# Folder to save uploaded product images
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # points to app
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads", "products")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ----------------------------
# GET ALL PRODUCTS
# ----------------------------
@product_bp.route("/", methods=["GET"])
def get_products():
    products = ProductService.get_all_products()
    return jsonify([p.to_dict() for p in products]), 200

# ----------------------------
# GET PRODUCT BY ID
# ----------------------------
@product_bp.route("/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = ProductService.get_product_by_id(product_id)
    product_dict = product.to_dict()
    if product_dict.get("image"):
        product_dict["image"] = request.host_url + "static/uploads/products/" + product_dict["image"]
    else:
        product_dict["image"] = request.host_url + "static/uploads/products/no-image.png"
    return jsonify(product_dict), 200


# ----------------------------
# CREATE PRODUCT
# ----------------------------
@product_bp.route("/", methods=["POST"])
def create_product():
    try:
        # JSON or Form-data
        if request.is_json:
            data = request.get_json()
            file = None
            filename = None
        else:
            data = request.form.to_dict()
            file = request.files.get("image")
            filename = None
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, filename))

        # Create product
        result = ProductService.create_product(data, image_filename=filename)

        # Check if duplicate error returned
        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]

        return jsonify({
            "status": "success",
            "message": "Product created successfully",
            "product": result.to_dict()
        }), 201

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----------------------------
# UPDATE PRODUCT
# ----------------------------
@product_bp.route("/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    try:
        if request.is_json:
            data = request.get_json()
            file = None
            filename = None
        else:
            data = request.form.to_dict()
            file = request.files.get("image")
            filename = None
            if file:
                filename = secure_filename(file.filename)
                file.save(os.path.join(UPLOAD_FOLDER, filename))

        result = ProductService.update_product(product_id, data, image_filename=filename)

        # Check if duplicate error returned
        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]

        return jsonify({
            "status": "success",
            "message": "Product updated successfully",
            "product": result.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----------------------------
# DELETE PRODUCT
# ----------------------------
@product_bp.route("/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        result = ProductService.delete_product(product_id)

        # Check if error returned
        if isinstance(result, tuple):
            return jsonify(result[0]), result[1]

        return jsonify({"status": "success", "message": "Product deleted successfully"}), 200

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
