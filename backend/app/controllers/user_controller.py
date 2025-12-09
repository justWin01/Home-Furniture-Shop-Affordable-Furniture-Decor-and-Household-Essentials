from flask import Blueprint, request, jsonify
from app.services.user_service import UserService

user_bp = Blueprint("user_bp", __name__)

# GET ALL USERS
@user_bp.route("/", methods=["GET"])
def get_users():
    users = UserService.get_all_users()
    return jsonify([u.to_dict() for u in users])

# GET USER BY ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    u = UserService.get_user_by_id(user_id)
    return jsonify(u.to_dict())

# REGISTER USER (SIGN UP) - CUSTOMER ONLY
@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    try:
        data['role'] = 'Customer'  
        new_user = UserService.create_user(data)
        return jsonify({"message": "Account created successfully!", "user": new_user.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# REGISTER ADMIN - PROTECTED
@user_bp.route("/admin/register", methods=["POST"])
def register_admin():
    # TODO: Add admin authentication check here
    data = request.get_json()
    try:    
        data['role'] = 'Admin'  # Force role to Admin
        new_user = UserService.create_user(data)
        return jsonify({"message": "Admin created successfully!", "user": new_user.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


# REGISTER USER (ALTERNATIVE)
@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    try:
        new_user = UserService.create_user(data)
        return jsonify({"message": "User created successfully!", "user": new_user.to_dict()}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

# LOGIN USER
@user_bp.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()
    result, status = UserService.login_user(data)
    return jsonify(result), status

# ADMIN LOGIN
@user_bp.route("/admin/login", methods=["POST"])
def login_admin():
    data = request.get_json()
    result, status = UserService.login_admin(data)
    return jsonify(result), status


# FORGOT PASSWORD
@user_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    user = UserService.get_user_by_email(email)
    if not user:
        return jsonify({"error": "Email not found"}), 404

    # Later: email sending logic here
    return jsonify({"message": "Password reset instructions sent!"}), 200

# UPDATE USER
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.get_json()
    UserService.update_user(user_id, data)
    return jsonify({"message": "User updated successfully"})

# DELETE USER
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    UserService.delete_user(user_id)
    return jsonify({"message": "User deleted successfully"})
