import os
from datetime import timedelta
from secrets import token_hex

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# JWT Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', token_hex(32))  # Tạo key ngẫu nhiên nếu không có trong env
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Token hết hạn sau 1 giờ
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh token hết hạn sau 30 ngày
JWT_ALGORITHM = 'HS256'

# Security Configuration
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
MAX_CONNECTIONS_PER_IP = int(os.getenv('MAX_CONNECTIONS_PER_IP', '5'))
RATE_LIMIT_MESSAGES = int(os.getenv('RATE_LIMIT_MESSAGES', '60'))

# Các cấu hình bảo mật khác
PASSWORD_SALT = os.getenv('PASSWORD_SALT', token_hex(16))
MIN_PASSWORD_LENGTH = 8
BCRYPT_ROUNDS = 12  # Số vòng hash cho bcrypt

JWT_SECRET_KEY = 'your_jwt_secret_key'  # Khóa bí mật cho JWT
SECRET_KEY = 'your_secret_key'  # Khóa bí mật cho ứng dụng
MAX_CONNECTIONS_PER_IP = 10  # Ví dụ về biến khác
RATE_LIMIT_MESSAGES = 5  # Ví dụ về biến khác