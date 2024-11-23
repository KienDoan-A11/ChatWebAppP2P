Thên @token_required trước các route cần bảo mật

Ví dụ 
@app.route('/login', methods=['POST'])
@token_required
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

  if username == 'admin' and password == 'password':
        token = encode_jwt(user_id=1, secret_key=app.config['SECRET_KEY'])
        return jsonify({'token': token})

  return jsonify({'message': 'Invalid credentials!'}), 401

  
