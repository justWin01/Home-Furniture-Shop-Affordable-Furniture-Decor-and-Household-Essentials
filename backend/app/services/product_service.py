from extensions import db
from app.models.product import Product
from sqlalchemy.exc import IntegrityError

class ProductService:

    # ======================
    # GET ALL PRODUCTS
    # ======================
    @staticmethod
    def get_all_products():
        return Product.query.all()

    # ======================
    # GET PRODUCT BY ID
    # ======================
    @staticmethod
    def get_product_by_id(product_id):
        return Product.query.get_or_404(product_id)

    # ======================
    # CREATE PRODUCT
    # ======================
    @staticmethod
    def create_product(data, image_filename=None):

        # ----- DUPLICATE NAME CHECK -----
        existing = Product.query.filter_by(product_name=data.get("product_name")).first()
        if existing:
            return {"error": "Product name already exists"}, 400

        # Safe conversions
        try:
            price = float(data.get("price", 0) or 0)
        except ValueError:
            price = 0.0

        try:
            stock_quantity = int(data.get("stock_quantity", 0) or 0)
            stock_quantity = 0
        except ValueError:
            stock_quantity = 0

        try:
            category_id = int(data.get("category_id")) if data.get("category_id") else None
        except ValueError:
            category_id = None

        # Create product object
        product = Product(
            product_name=data.get("product_name"),
            price=price,
            stock_quantity=0,
            description=data.get("description"),
            category_id=category_id,
            image=image_filename
        )

        db.session.add(product)

        # Database commit handling
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Failed to create product."}, 500

        return product

    # ======================
    # UPDATE PRODUCT
    # ======================
    @staticmethod
    def update_product(product_id, data, image_filename=None):

        product = Product.query.get_or_404(product_id)

        # ----- DUPLICATE NAME CHECK -----
        new_name = data.get("product_name")
        if new_name and new_name != product.product_name:
            existing = Product.query.filter_by(product_name=new_name).first()
            if existing:
                return {"error": "Product name already exists"}, 400

        # Update fields
        if new_name:
            product.product_name = new_name

        if data.get("price") is not None:
            try:
                product.price = float(data["price"])
            except ValueError:
                pass

        if data.get("stock_quantity") is not None:
            try:
                product.stock_quantity = int(data["stock_quantity"])
            except ValueError:
                pass

        if data.get("description"):
            product.description = data["description"]

        if data.get("category_id") is not None:
            try:
                product.category_id = int(data["category_id"])
            except ValueError:
                pass

        if image_filename:
            product.image = image_filename

        # Commit changes
        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Failed to update product."}, 500

        return product

    # ======================
    # DELETE PRODUCT
    # ======================
    @staticmethod
    def delete_product(product_id):
        product = Product.query.get_or_404(product_id)

        db.session.delete(product)

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Failed to delete product."}, 500

        return True
