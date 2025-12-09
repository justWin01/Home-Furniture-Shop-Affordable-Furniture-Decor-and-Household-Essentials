from extensions import db

class Product(db.Model):
    __tablename__ = 'products'

    # PRODUCT MODEL FIELDS
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10,2), nullable=False)
    stock_quantity = db.Column(db.Integer, default=0)
    image = db.Column(db.String(255))
    category_id = db.Column(db.Integer,db.ForeignKey('categories.category_id'))

    # RELATIONSHIPS
    order_details = db.relationship('OrderDetails', backref='product', lazy=True)

    # STRING REPRESENTATION
    def __repr__(self):
        return f"<Product {self.product_name}>"

    # CONVERT TO DICTIONARY
    def to_dict(self):
        return {
            "product_id": self.product_id,
            "product_name": self.product_name,
            "description": self.description,
            "price": float(self.price),
            "stock_quantity": self.stock_quantity,
            "image": self.image,
            "category_id": self.category_id
        }
