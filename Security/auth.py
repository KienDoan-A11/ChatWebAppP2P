import jwt
import datetime
from flask import Flask,request, jsonify,make_response
from functools import wraps
from flask_bcrypt import Bcrypt 
from encryption import token_required,encode_jwt

app = Flask(__name__)
app.secret_key = 'your_secret_key'
bcrypt = Bcrypt(app)

@app.route('/login', methods=['POST']) 
@token_required 
def login(): 
    data = request.get_json() 
    username = data.get('username') 
    password = data.get('password')
    if username == 'admin' and password == 'password': 
       token = encode_jwt(user_id=1, secret_key=app.config['SECRET_KEY']) 
       return jsonify({'token': token})
    return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Mã hóa mật khẩu
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Tạo token JWT
    token = jwt.encode({
        'username': username,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, app.secret_key, algorithm='HS256')

    # Lưu token vào cookie
    response = make_response(jsonify({"message": "User registered successfully"}))
    response.set_cookie('auth_token', token, httponly=True)

    return response

@app.route('/get_user', methods=['GET'])
def get_user():
    token = request.cookies.get('auth_token')
    if not token:
        return jsonify({"error": "No token found"}), 403

    try:
        decoded_token = jwt.decode(token, app.secret_key, algorithms=['HS256'])
        return jsonify({"user": decoded_token}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 403
    
if __name__ == '__main__':
    app.run(debug=True)