from flask import Flask
from app.controllers.product_controller import product_bp
from app.controllers.orders_controller import orders_bp
from app.controllers.order_details_controller import order_details_bp
from app.controllers.category_controller import category_bp
from app.controllers.user_controller import user_bp

def register_routes(app: Flask):
  
    #all blueprints with their URL prefixes
    
    # User routes
    app.register_blueprint(user_bp, url_prefix="/api/users")

    # Product routes 
    app.register_blueprint(product_bp, url_prefix='/api/products')

    # Orders routes 
    app.register_blueprint(orders_bp, url_prefix='/api/orders')

    # Order DetailAs routes 
    app.register_blueprint(order_details_bp, url_prefix='/api/order_details')

    # Category routes 
    app.register_blueprint(category_bp, url_prefix='/api/categories')
