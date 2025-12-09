from extensions import db
from app.models.category import Category

class CategoryService:

    # GET ALL CATEGORIES
    @staticmethod
    def get_all_categories():
        return Category.query.all()

    # GET CATEGORY BY ID
    @staticmethod
    def get_category_by_id(category_id):
        return Category.query.get_or_404(category_id)

    # CREATE CATEGORY
    @staticmethod
    def create_category(data):
        category = Category(
            category_name=data["category_name"],
            description=data.get("description")
        )
        db.session.add(category)
        db.session.commit()
        return category

    # UPDATE CATEGORY
    @staticmethod
    def update_category(category_id, data):
        category = Category.query.get_or_404(category_id)
        category.category_name = data.get("category_name", category.category_name)
        category.description = data.get("description", category.description)
        db.session.commit()
        return category

    # DELETE CATEGORY
    @staticmethod
    def delete_category(category_id):
        category = Category.query.get_or_404(category_id)
        db.session.delete(category)
        db.session.commit()
        return True
