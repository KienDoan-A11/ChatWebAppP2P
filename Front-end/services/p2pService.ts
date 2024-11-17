import { io, Socket } from 'socket.io-client';

interface LoginResponse {
  status: string;
  token: string;
  peerId: string;
}

interface Peer {
  peerId: string;
  name: string;
  status: 'online' | 'offline';   
}

interface SignupResponse {
  status: string;
  message: string;
  token: string;
  peerId: string;
}

export class P2PService {
  private peerConnection: RTCPeerConnection | null = null;
  public socket!: Socket;
  private dataChannel: RTCDataChannel | null = null;
  public peerId: string = '';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    try {
      this.socket = io('http://localhost:5000', {
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling'],
        timeout: 10000,
        autoConnect: true,
        withCredentials: true
      });

      this.setupSocketListeners();
    } catch (error) {
      console.error('Socket initialization error:', error);
    }

    // Thông báo server khi peer online sau khi login/signup thành công
    if (this.peerId) {
        this.socket.emit('peer_connect', {
            peerId: this.peerId,
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email')
        });
    }
  }

  private setupSocketListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Đã kết nối với server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connect error:', error);
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          console.log('Đang thử kết nối lại...');
          this.socket.connect();
        }, 1000);
        this.reconnectAttempts++;
      }
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Mất kết nối với server:', reason);
    });

    this.socket.on('offer', async (data) => {
      await this.handleOffer(data.offer, data.fromPeerId);
    });

    this.socket.on('answer', async (data) => {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      }
    });

    this.socket.on('ice_candidate', async (data) => {
      if (this.peerConnection) {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });

    this.socket.on('peer_joined', (data) => {
      console.log('New peer joined:', data.username);
    });

    this.socket.on('peer_left', (data) => {
      console.log('Peer disconnected:', data.peerId);
    });
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Không thể kết nối đến server');
      }

      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email, 
          password: password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      if (!data.peerId || !data.token) {
        throw new Error('Server không trả về đủ thông tin cần thiết');
      }

      this.peerId = data.peerId;
      localStorage.setItem('token', data.token);
      localStorage.setItem('peerId', data.peerId);

      return {
        status: data.status,
        token: data.token,
        peerId: data.peerId
      };
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Đã xảy ra lỗi không xác định');
      }
    }
  }

  private async handleResponse(response: Response) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Network response was not ok');
    }
    return data;
  }

  async initializePeerConnection(targetPeerId: string) {
    try {
      this.peerId = targetPeerId;
      localStorage.setItem('peerId', this.peerId);

      // Khởi tạo WebRTC connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Setup listeners and handlers
      this.setupDataChannel();
      
      // Thông báo online status
      await this.announceOnline();
      
    } catch (error) {
      console.error('Error initializing peer connection:', error);
      throw error;
    }
  }

  private setupDataChannel() {
    if (!this.dataChannel) return;

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
    };

    this.dataChannel.onmessage = (event) => {
      console.log('Received message:', event.data);
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  async cleanup() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit, fromPeerId: string) {
    try {
      if (!this.peerConnection) {
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        this.peerConnection.ondatachannel = (event) => {
          this.dataChannel = event.channel;
          this.setupDataChannel();
        };
      }

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('answer', {
        answer: answer,
        targetPeerId: fromPeerId
      });

    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      throw new Error('PeerConnection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Error handling answer:', error);
      throw error;
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) {
      throw new Error('PeerConnection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      throw error;
    }
  }

  async sendMessage(message: string) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      throw new Error('Data channel is not ready');
    }

    try {
      this.dataChannel.send(JSON.stringify({
        content: message,
        timestamp: new Date(),
        sender: this.peerId
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getAvailablePeers(): Promise<Peer[]> {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/peers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get peers');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting peers:', error);
      throw error;
    }
  }

  async connectToPeer(targetPeerId: string) {
    try {
      if (!this.peerConnection) {
        this.peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        // Tạo data channel
        this.dataChannel = this.peerConnection.createDataChannel('messageChannel');
        this.setupDataChannel();

        // Xử lý ICE candidates
        this.peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit('ice_candidate', {
              candidate: event.candidate,
              targetPeerId: targetPeerId
            });
          }
        };
      }

      // Tạo và gửi offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      
      this.socket.emit('offer', {
        offer: offer,
        targetPeerId: targetPeerId
      });

    } catch (error) {
      console.error('Error connecting to peer:', error);
      throw error;
    }
  }

  async acceptConnection(fromPeerId: string): Promise<void> {
    try {
      const answer = await this.peerConnection?.createAnswer();
      await this.peerConnection?.setLocalDescription(answer);

      this.socket.emit('answer', {
        target: fromPeerId,
        answer: answer
      });

      console.log('Accepted connection from:', fromPeerId);
    } catch (error) {
      console.error('Error accepting connection:', error);
      throw error;
    }
  }

  sendP2PSignal(data: any) {
    this.socket.emit('p2p_signal', data);
  }

  async checkConnection(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.socket) {
        resolve(false);
        return;
      }

      const timeout = setTimeout(() => {
        resolve(false);
      }, 5000);

      if (this.socket.connected) {
        clearTimeout(timeout);
        resolve(true);
        return;
      }

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        resolve(true);
      });

      this.socket.once('connect_error', () => {
        clearTimeout(timeout);
        resolve(false);
      });

      this.socket.connect();
    });
  }

  async signup(email: string, password: string, username: string): Promise<SignupResponse> {
    try {
      const isConnected = await this.checkConnection();
      if (!isConnected) {
        throw new Error('Không thể kết nối đến server');
      }

      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email,
          password,
          username
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      this.peerId = data.peerId;
      localStorage.setItem('token', data.token);
      localStorage.setItem('peerId', data.peerId);

      return data;
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error('Đã xảy ra lỗi không xác định');
      }
    }
  }

  async getOnlinePeers(): Promise<Peer[]> {
    try {
      const response = await fetch('http://localhost:5000/api/peers/online');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get online peers');
      }
      
      return data.peers;
    } catch (error) {
      console.error('Error getting online peers:', error);
      throw error;
    }
  }

  // Thêm method để thông báo online status
  async announceOnline() {
    if (this.peerId) {
        this.socket.emit('peer_connect', {
            peerId: this.peerId,
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email')
        });
    }
  }
}

export const p2pService = new P2PService(); 