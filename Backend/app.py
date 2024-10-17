from flask import Flask  # Nhập Flask để tạo ứng dụng web
from flask_socketio import SocketIO  # Nhập SocketIO để hỗ trợ WebSocket
from routes import setup_routes  # Nhập hàm setup_routes từ module routes

app = Flask(__name__)  # Khởi tạo ứng dụng Flask
app.config['SECRET_KEY'] = 'your_secret_key'  # Đặt một khóa bí mật cho ứng dụng
socketio = SocketIO(app)  # Khởi tạo SocketIO với ứng dụng Flask

setup_routes(app, socketio)  # Gọi hàm để thiết lập các route cho ứng dụng

if __name__ == '__main__':  # Kiểm tra nếu file này được chạy trực tiếp
    socketio.run(app, debug=True)  # Chạy ứng dụng với chế độ debug

''' venv\Scripts\activate
'''