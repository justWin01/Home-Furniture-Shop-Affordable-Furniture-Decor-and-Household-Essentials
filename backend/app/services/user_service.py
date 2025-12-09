from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from app.models.user import User

class UserService:

    # ======================
    # CREATE USER
    # ======================
    @staticmethod
    def create_user(data):
        # Validate required fields
        required_fields = ['full_name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data or not data[field]:
                raise ValueError(f"{field} is required")

        # Validate role
        if data['role'] not in ['Customer', 'Admin']:
            raise ValueError("Invalid role. Must be 'Customer' or 'Admin'.")

        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            raise ValueError("Email already registered")

        # Hash the password
        hashed_password = generate_password_hash(data['password'])

        # Create user instance
        new_user = User(
            full_name=data['full_name'],
            email=data['email'],
            password=hashed_password,
            contact_number=data.get('contact_number'),
            address=data.get('address'),
            role=data['role']
        )

        # Save to database
        db.session.add(new_user)
        db.session.commit()

        return new_user

        # ======================
    # LOGIN CUSTOMER ONLY
    # ======================
    @staticmethod
    def login_user(data):
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        # Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            return {"error": "Invalid credentials"}, 401

        # Check password
        if not check_password_hash(user.password, password):
            return {"error": "Invalid credentials"}, 401

        # Only customers
        if user.role != 'Customer':
            return {"error": "Unauthorized: Customers only"}, 403

        return {"message": "Login successful", "role": user.role, "user": user.to_dict()}, 200


    # ======================
    # LOGIN ADMIN ONLY
    # ======================
    @staticmethod
    def login_admin(data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return {"error": "Invaljid credentials"}, 401

        # Admins only
        if user.role != 'Admin':
            return {"error": "Unauthorized: Admin only"}, 403

        return {"message": "Admin login successful", "role": user.role, "user": user.to_dict()}, 200



    # ======================
    # GET USER BY EMAIL
    # ======================
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    # ======================
    # GET ALL USERS
    # ======================
    @staticmethod
    def get_all_users():
        return User.query.all()

    # ======================
    # GET USER BY ID
    # ======================
    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get_or_404(user_id)

    # ======================
    # UPDATE USER
    # ======================
    @staticmethod
    def update_user(user_id, data):
        user = User.query.get_or_404(user_id)
        for key, value in data.items():
            if key == 'password' and value:
                setattr(user, key, generate_password_hash(value))
            elif hasattr(user, key):
                setattr(user, key, value)
        db.session.commit()

    # ======================
    # DELETE USER
    # ======================
    @staticmethod
    def delete_user(user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
