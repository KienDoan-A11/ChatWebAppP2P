import { useState, useEffect } from 'react';
import { p2pService } from '../services/p2pService';

type Peer = {
  peerId: string;
  name: string;
};

export default function PeerList() {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeers();
    
    // Lắng nghe sự kiện peer mới online
    p2pService.socket.on('peer_joined', (data) => {
        console.log('Peer joined:', data);
        loadPeers(); // Reload danh sách peers
    });

    // Lắng nghe sự kiện peer offline
    p2pService.socket.on('peer_left', (data) => {
        console.log('Peer left:', data);
        loadPeers(); // Reload danh sách peers
    });

    return () => {
        p2pService.socket.off('peer_joined');
        p2pService.socket.off('peer_left');
    };
  }, []);

  const loadPeers = async () => {
    try {
      setLoading(true);
      const availablePeers = await p2pService.getAvailablePeers();
      setPeers(availablePeers);
    } catch (err) {
      setError('Failed to load peers');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (peerId: string) => {
    try {
      await p2pService.connectToPeer(peerId);
    } catch (err) {
      setError('Failed to connect to peer');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Peers</h2>
      
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading ? (
        <div>Loading peers...</div>
      ) : (
        <div className="space-y-2">
          {peers.map((peer) => (
            <div 
              key={peer.peerId}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <div>
                <div className="font-medium">{peer.name}</div>
                <div className="text-sm text-gray-400">ID: {peer.peerId}</div>
              </div>
              <button
                onClick={() => handleConnect(peer.peerId)}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 