from extensions import db

class Category(db.Model):
    __tablename__ = 'categories'

    # CATEGORY MODEL FIELDS
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)

    # RELATIONSHIPS
    products = db.relationship('Product', backref='category', lazy=True)

    # STRING REPRESENTATION
    def __repr__(self):
        return f"<Category {self.category_name}>"

    # CONVERT TO DICTIONARY
    def to_dict(self):
        return {
            "category_id": self.category_id,
            "category_name": self.category_name,
            "description": self.description
        }
