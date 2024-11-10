import jwt
import datetime
from flask import request, jsonify
from functools import wraps

def encode_jwt(user_id, secret_key):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

def decode_jwt(token, secret_key):
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            from app import app  # import để lấy SECRET_KEY từ app
            user_id = decode_jwt(token, app.config['SECRET_KEY'])
            if not user_id:
                return jsonify({'message': 'Token is invalid or expired!'}), 403
        except:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(user_id, *args, **kwargs)

    return decorated