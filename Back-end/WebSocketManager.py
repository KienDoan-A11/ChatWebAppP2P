from flask_socketio import Namespace, emit, disconnect
from flask import request
from datetime import datetime
import logging
import jwt
from config import JWT_SECRET_KEY, MAX_CONNECTIONS_PER_IP, RATE_LIMIT_MESSAGES

class WebSocketManager(Namespace):
    def __init__(self, namespace):
        super().__init__(namespace)
        self.active_connections = {}  # {socket_id: connection_info}
        self.ip_connections = {}      # {ip: count}
        self.message_count = {}       # {socket_id: {timestamp: count}}
        
    def _authenticate_connection(self):
        """Xác thực token từ request"""
        try:
            token = request.args.get('token')
            if not token:
                logging.warning(f"No token provided - IP: {request.remote_addr}")
                return False
                
            payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
            return payload
        except jwt.InvalidTokenError as e:
            logging.error(f"Invalid token from IP: {request.remote_addr} - Error: {str(e)}")
            return False

    def _check_rate_limit(self, socket_id):
        """Kiểm tra rate limit cho messages"""
        now = datetime.now()
        if socket_id not in self.message_count:
            self.message_count[socket_id] = {now: 1}
            return True
            
        # Xóa các timestamp cũ
        self.message_count[socket_id] = {
            ts: count for ts, count in self.message_count[socket_id].items()
            if (now - ts).seconds < 60
        }
        
        # Kiểm tra số lượng tin nhắn trong 1 phút
        total_messages = sum(self.message_count[socket_id].values())
        return total_messages < RATE_LIMIT_MESSAGES

    def on_connect(self):
        """Xử lý kết nối mới"""
        try:
            # Xác thực kết nối
            auth_data = self._authenticate_connection()
            if not auth_data:
                disconnect()
                return
                
            # Kiểm tra giới hạn kết nối từ IP
            ip = request.remote_addr
            if ip in self.ip_connections:
                if self.ip_connections[ip] >= MAX_CONNECTIONS_PER_IP:
                    logging.warning(f"Too many connections from IP: {ip}")
                    disconnect()
                    return
                self.ip_connections[ip] += 1
            else:
                self.ip_connections[ip] = 1
                
            # Lưu thông tin kết nối
            self.active_connections[request.sid] = {
                'user_id': auth_data['user_id'],
                'ip': ip,
                'connected_at': datetime.now(),
                'last_activity': datetime.now()
            }
            
            logging.info(f"Client connected - User: {auth_data['user_id']} - IP: {ip}")
            
        except Exception as e:
            logging.error(f"Error in connection handling: {str(e)}")
            disconnect()

    def on_disconnect(self):
        """Xử lý ngắt kết nối"""
        try:
            if request.sid in self.active_connections:
                conn_info = self.active_connections[request.sid]
                ip = conn_info['ip']
                
                # Cập nhật số lượng kết nối từ IP
                if ip in self.ip_connections:
                    self.ip_connections[ip] -= 1
                    if self.ip_connections[ip] <= 0:
                        del self.ip_connections[ip]
                
                # Xóa thông tin kết nối
                del self.active_connections[request.sid]
                if request.sid in self.message_count:
                    del self.message_count[request.sid]
                    
                logging.info(f"Client disconnected - User: {conn_info['user_id']} - IP: {ip}")
                
        except Exception as e:
            logging.error(f"Error in disconnect handling: {str(e)}")

    def on_message(self, data):
        """Xử lý tin nhắn"""
        try:
            if request.sid not in self.active_connections:
                logging.warning(f"Message from unauthorized connection: {request.sid}")
                return
                
            # Kiểm tra rate limit
            if not self._check_rate_limit(request.sid):
                logging.warning(f"Rate limit exceeded for: {request.sid}")
                emit('error', {'message': 'Rate limit exceeded'})
                return
                
            # Cập nhật thời gian hoạt động
            self.active_connections[request.sid]['last_activity'] = datetime.now()
            
            # Validate và sanitize data
            if not isinstance(data, dict) or 'message' not in data:
                logging.warning(f"Invalid message format from: {request.sid}")
                return
                
            # Broadcast tin nhắn
            emit('new_message', {
                'user_id': self.active_connections[request.sid]['user_id'],
                'message': data['message'],
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)
            
        except Exception as e:
            logging.error(f"Error in message handling: {str(e)}")
