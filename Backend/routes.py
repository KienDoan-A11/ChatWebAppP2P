from flask import request, jsonify  # Nhập các thành phần cần thiết từ Flask
from flask_socketio import emit  # Nhập hàm emit từ Flask-SocketIO

def setup_routes(app, socketio):
    # Định nghĩa route cho địa chỉ gốc
    @app.route('/', methods=['GET'])
    def home():
        return jsonify({'message': 'Welcome to the Chat Web App!'})

    # Định nghĩa route cho gửi tin nhắn
    @app.route('/api/messages', methods=['POST'])  
    def send_message():
        data = request.json  
        if not data or 'message' not in data:
            return jsonify({'error': 'Invalid data'}), 400  # Trả về lỗi nếu không có dữ liệu hợp lệ
        socketio.emit('new_message', data)  
        return jsonify({'status': 'Message sent'})

    # Định nghĩa route cho lấy danh sách người dùng
    @app.route('/api/users', methods=['GET'])  
    def get_users():
        users = ['user1', 'user2', 'user3']  
        return jsonify({'users': users})  # Trả về danh sách người dùng trong một JSON object
