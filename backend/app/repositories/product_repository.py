from app.models.product import Product
from extensions import db

class ProductRepository:

    @staticmethod
    def get_all():
        return Product.query.all()

    @staticmethod
    def get_by_id(product_id):
        return Product.query.get(product_id)

    @staticmethod
    def create(product):
        db.session.add(product)
        db.session.commit()
        return product
