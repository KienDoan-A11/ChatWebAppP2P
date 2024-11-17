from flask_socketio import SocketIO
from datetime import datetime

# Dictionary để theo dõi peers đang online
online_peers = {}

def init_socket_handlers(socketio: SocketIO):
    @socketio.on('peer_connect')
    def handle_peer_connect(data):
        peer_id = data.get('peerId')
        if peer_id:
            print(f"Peer {peer_id} connected")
            online_peers[peer_id] = {
                'username': data.get('username'),
                'email': data.get('email'),
                'socket_id': socketio.request.sid,
                'connected_at': datetime.now().isoformat()
            }
            socketio.emit('peer_joined', {
                'peerId': peer_id,
                'username': data.get('username'),
                'timestamp': datetime.now().isoformat()
            }, broadcast=True)

    @socketio.on('disconnect')
    def handle_disconnect():
        for peer_id, data in online_peers.items():
            if data['socket_id'] == socketio.request.sid:
                del online_peers[peer_id]
                socketio.emit('peer_left', {
                    'peerId': peer_id
                }, broadcast=True)
                break

    @socketio.on('offer')
    def handle_offer(data):
        target_peer_id = data.get('targetPeerId')
        if target_peer_id in online_peers:
            target_socket_id = online_peers[target_peer_id]['socket_id']
            socketio.emit('offer', {
                'offer': data.get('offer'),
                'fromPeerId': socketio.request.sid
            }, room=target_socket_id)

    @socketio.on('answer')
    def handle_answer(data):
        target_peer_id = data.get('targetPeerId')
        if target_peer_id in online_peers:
            target_socket_id = online_peers[target_peer_id]['socket_id']
            socketio.emit('answer', {
                'answer': data.get('answer'),
                'fromPeerId': socketio.request.sid
            }, room=target_socket_id)

    @socketio.on('ice_candidate')
    def handle_ice_candidate(data):
        target_peer_id = data.get('targetPeerId')
        if target_peer_id in online_peers:
            target_socket_id = online_peers[target_peer_id]['socket_id']
            socketio.emit('ice_candidate', {
                'candidate': data.get('candidate'),
                'fromPeerId': socketio.request.sid
            }, room=target_socket_id) 