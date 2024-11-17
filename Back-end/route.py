from flask import Blueprint, request, jsonify
import uuid
from socket_handlers import online_peers

route_bp = Blueprint('routes', __name__)

# List to hold users
users = [
    {
        'email': 'test@example.com',
        'password': 'password123',
        'peerId': 'peer_test_1',
        'username': 'testuser'
    }
]

def find_user_by_email(email):
    for user in users:
        if user['email'] == email:
            return user
    return None

@route_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'status': 'error', 'message': 'Email and password are required'}), 400

        # Tìm user và kiểm tra password
        user = find_user_by_email(email)
        if not user or user['password'] != password:  # Trong thực tế nên hash password
            return jsonify({
                'status': 'error',
                'message': 'Email hoặc mật khẩu không đúng'
            }), 401
            
        # Trả về peerId đã có của user
        return jsonify({
            'status': 'success',
            'token': 'your-auth-token',
            'peerId': user['peerId']  # Trả về peerId đã có
        })
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@route_bp.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        username = data.get('username')
        
        if not email or not password or not username:
            return jsonify({
                'status': 'error', 
                'message': 'Email, password and username are required'
            }), 400

        # Kiểm tra email đã tồn tại chưa
        if find_user_by_email(email):
            return jsonify({
                'status': 'error',
                'message': 'Email đã được sử dụng'
            }), 400

        # Tạo peer ID mới cho user mới
        new_peer_id = 'peer_' + str(uuid.uuid4())

        # Thêm user mới với peer ID mới
        new_user = {
            'email': email,
            'password': password,
            'username': username,
            'peerId': new_peer_id  # Tạo peerId mới cho user mới
        }
        users.append(new_user)
        
        print(f"New user registered: {email} with peerId: {new_peer_id}")
        
        return jsonify({
            'status': 'success',
            'message': 'Đăng ký thành công',
            'token': 'your-auth-token',
            'peerId': new_peer_id  # Trả về peerId mới
        })

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@route_bp.route('/api/peers/online', methods=['GET'])
def get_online_peers():
    try:
        peer_list = [{
            'peerId': peer_id,
            'username': data['username'],
            'email': data['email']
        } for peer_id, data in online_peers.items()]
        
        return jsonify({
            'status': 'success',
            'peers': peer_list
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@route_bp.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'})