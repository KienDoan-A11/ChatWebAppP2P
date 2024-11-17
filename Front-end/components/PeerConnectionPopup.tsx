import React from 'react';

interface PeerConnectionPopupProps {
  peerId: string;
  onAccept: () => void;
  onReject: () => void;
}

const PeerConnectionPopup: React.FC<PeerConnectionPopupProps> = ({ peerId, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Kết nối từ Peer</h2>
        <p>Peer ID: {peerId} muốn kết nối với bạn.</p>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={onReject}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Từ chối
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeerConnectionPopup; 