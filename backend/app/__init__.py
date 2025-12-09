from flask import Flask, jsonify
from extensions import db, jwt, cors
from config import Config

from app.routes import register_routes


def create_app():
    """Create and configure the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)

    # Root route
    @app.route("/")
    def home():
        return "<h2>Backend is running!</h2><p>Go to <a href='/api'>/api</a> for API endpoints</p>"

    # API documentation route
    @app.get("/api")
    def api_info():
        return jsonify({
            "endpoints": {
                "get_all_users": "/api/users - List of all users",
                "get_user_by_id": "/api/users/<id> - Get specific user",
                "/signup_user": {
                    "endpoint": "/api/users/signup",
                    "method": "POST",
                    "body": {
                        "full_name": "",
                        "email": "",
                        "password": "",
                        "contact_number": "",
                        "address": ""
                    }
                },
                "login_user": {
                    "endpoint": "/api/users/login",
                    "method": "POST",
                    "body": {
                        "email": "",
                        "password": ""
                    }
                },
                "update_user": {
                    "endpoint": "/api/users/<id>",
                    "method": "PUT",
                    "body": {
                        "full_name": "",
                        "email": "",
                        "password": ""
                    }
                },
                "delete_user": "/api/users/<id> - DELETE user",
                "categories": "/api/categories - Full CRUD",
                "products": "/api/products - Full CRUD",
                "orders": "/api/orders - Full CRUD",
                "order_details": "/api/order-details - Full CRUD"
            }
        })


    # Register all blueprints
    register_routes(app)

    # Create all tables
    with app.app_context():
        db.create_all()

    return app
