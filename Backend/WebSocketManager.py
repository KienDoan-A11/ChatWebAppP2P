from flask_socketio import Namespace, emit  # Nhập Namespace để tạo namespace và emit để gửi thông điệp
from flask_socketio import SocketIO  # Nhập SocketIO để sử dụng trong ứng dụng

class WebSocketManager(Namespace):  
    def on_connect(self):  # Phương thức xử lý khi client kết nối
        print('Client connected')  # In thông báo khi có client kết nối

    def on_disconnect(self):  # Phương thức xử lý khi client ngắt kết nối
        print('Client disconnected')  # In thông báo khi client ngắt kết nối

    def on_message(self, msg):  # Phương thức xử lý khi nhận được tin nhắn từ client
        emit('new_message', msg, broadcast=True)  # Gửi tin nhắn đến tất cả client đang kết nối
