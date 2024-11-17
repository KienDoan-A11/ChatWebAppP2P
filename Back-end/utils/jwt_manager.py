from datetime import datetime
import jwt
from config import (
    JWT_SECRET_KEY, 
    JWT_ACCESS_TOKEN_EXPIRES, 
    JWT_REFRESH_TOKEN_EXPIRES,
    JWT_ALGORITHM
)
import logging

class JWTManager:
    @staticmethod
    def generate_tokens(user_data):
        """Tạo cả access token và refresh token"""
        try:
            # Tạo access token
            access_token_payload = {
                'user_id': user_data['id'],
                'email': user_data['email'],
                'type': 'access',
                'exp': datetime.utcnow() + JWT_ACCESS_TOKEN_EXPIRES,
                'iat': datetime.utcnow()
            }
            
            access_token = jwt.encode(
                access_token_payload,
                JWT_SECRET_KEY,
                algorithm=JWT_ALGORITHM
            )
            
            # Tạo refresh token
            refresh_token_payload = {
                'user_id': user_data['id'],
                'type': 'refresh',
                'exp': datetime.utcnow() + JWT_REFRESH_TOKEN_EXPIRES,
                'iat': datetime.utcnow()
            }
            
            refresh_token = jwt.encode(
                refresh_token_payload,
                JWT_SECRET_KEY,
                algorithm=JWT_ALGORITHM
            )
            
            return {
                'access_token': access_token,
                'refresh_token': refresh_token,
                'expires_in': JWT_ACCESS_TOKEN_EXPIRES.total_seconds()
            }
            
        except Exception as e:
            logging.error(f"Error generating tokens: {str(e)}")
            raise

    @staticmethod
    def verify_token(token, token_type='access'):
        """Xác thực và giải mã token"""
        try:
            payload = jwt.decode(
                token,
                JWT_SECRET_KEY,
                algorithms=[JWT_ALGORITHM]
            )
            
            # Kiểm tra loại token
            if payload.get('type') != token_type:
                raise jwt.InvalidTokenError('Invalid token type')
                
            return payload
            
        except jwt.ExpiredSignatureError:
            logging.warning(f"Expired token attempt: {token[:10]}...")
            raise
        except jwt.InvalidTokenError as e:
            logging.warning(f"Invalid token: {str(e)}")
            raise
        except Exception as e:
            logging.error(f"Token verification error: {str(e)}")
            raise

    @staticmethod
    def refresh_access_token(refresh_token):
        """Tạo access token mới từ refresh token"""
        try:
            # Xác thực refresh token
            payload = JWTManager.verify_token(refresh_token, 'refresh')
            
            # Tạo access token mới
            new_access_token_payload = {
                'user_id': payload['user_id'],
                'type': 'access',
                'exp': datetime.utcnow() + JWT_ACCESS_TOKEN_EXPIRES,
                'iat': datetime.utcnow()
            }
            
            new_access_token = jwt.encode(
                new_access_token_payload,
                JWT_SECRET_KEY,
                algorithm=JWT_ALGORITHM
            )
            
            return {
                'access_token': new_access_token,
                'expires_in': JWT_ACCESS_TOKEN_EXPIRES.total_seconds()
            }
            
        except Exception as e:
            logging.error(f"Error refreshing token: {str(e)}")
            raise 