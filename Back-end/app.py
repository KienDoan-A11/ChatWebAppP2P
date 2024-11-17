from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import logging
from socket_handlers import init_socket_handlers

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

socketio = SocketIO(
    app,
    cors_allowed_origins=["http://localhost:3000"],
    logger=True,
    engineio_logger=True,
    ping_timeout=10000,
    ping_interval=5000,
    async_mode='threading',
    always_connect=True,
    reconnection=True,
    reconnection_attempts=5,
    reconnection_delay=1000
)

# Khởi tạo socket handlers
init_socket_handlers(socketio)

# Import routes sau khi tạo app và socketio
from route import route_bp
app.register_blueprint(route_bp)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
