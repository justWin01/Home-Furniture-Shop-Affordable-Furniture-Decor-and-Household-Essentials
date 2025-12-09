from flask import Blueprint, request, jsonify
from app.services.category_service import CategoryService

category_bp = Blueprint("category_bp", __name__)

# GET ALL CATEGORIES
@category_bp.route("/", methods=["GET"])
def get_categories():
    categories = CategoryService.get_all_categories()
    return jsonify([{
        "category_id": c.category_id,
        "category_name": c.category_name,
        "description": c.description
    } for c in categories])

# GET CATEGORY BY ID
@category_bp.route("/<int:category_id>", methods=["GET"])
def get_category(category_id):
    c = CategoryService.get_category_by_id(category_id)
    return jsonify({
        "category_id": c.category_id,
        "category_name": c.category_name,
        "description": c.description
    })

# CREATE CATEGORY
@category_bp.route("/", methods=["POST"])
def create_category():
    data = request.get_json()
    CategoryService.create_category(data)
    return jsonify({"message": "Category created"}), 201

# UPDATE CATEGORY
@category_bp.route("/<int:category_id>", methods=["PUT"])
def update_category(category_id):
    data = request.get_json()
    CategoryService.update_category(category_id, data)
    return jsonify({"message": "Category updated"})

# DELETE CATEGORY
@category_bp.route("/<int:category_id>", methods=["DELETE"])
def delete_category(category_id):
    CategoryService.delete_category(category_id)
    return jsonify({"message": "Category deleted"})
