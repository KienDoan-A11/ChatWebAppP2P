from flask import request, jsonify  # Nhập các thành phần cần thiết từ Flask
import jwt  # Nhập thư viện JWT để mã hóa và giải mã token
import datetime  # Nhập thư viện datetime để xử lý thời gian

SECRET_KEY = 'your_secret_key'  # Khóa bí mật dùng để mã hóa và giải mã token

def encode_token(user):
    # Hàm mã hóa token cho người dùng
    payload = {
        'user': user,  # Dữ liệu người dùng để mã hóa
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)  # Thời gian hết hạn của token (1 ngày)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')  # Mã hóa payload thành token

def auth_required(f):
    # Decorator để kiểm tra tính hợp lệ của token
    def decorator(*args, **kwargs):
        token = request.headers.get('Authorization')  # Lấy token từ header Authorization
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403  # Trả về lỗi nếu không có token
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])  # Giải mã token
            current_user = data['user']  # Lấy thông tin người dùng từ token
        except:
            return jsonify({'message': 'Token is invalid!'}), 403  # Trả về lỗi nếu token không hợp lệ
        return f(current_user, *args, **kwargs)  # Gọi hàm đã trang trí với thông tin người dùng
    return decorator  # Trả về hàm trang trí
