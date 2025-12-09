from extensions import db

class OrderDetails(db.Model):
    __tablename__ = 'order_details'

    # ORDER DETAILS MODEL FIELDS
    order_detail_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('products.product_id'))
    quantity = db.Column(db.Integer, default=1)
    subtotal = db.Column(db.Numeric(10,2))

    # STRING REPRESENTATION
    def __repr__(self):
        return f"<OrderDetail {self.order_detail_id}>"

    # CONVERT TO DICTIONARY
    def to_dict(self):
        return {
            "order_detail_id": self.order_detail_id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "subtotal": float(self.subtotal) if self.subtotal else 0
        }
