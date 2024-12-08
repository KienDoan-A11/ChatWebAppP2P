let peer;
let connections = {};
let currentUsername;
let selectedUser;
let socket;
let activeChat = null;
let chatContainers = {};
let messageHistory = {};
let unreadMessages = {};
const CHUNK_SIZE = 64 * 1024; // 64KB mỗi chunk
let fileChunks = {}; // Lưu trữ chunks khi nhận file
let sendingFiles = {}; // Theo dõi tiến trình gửi file

function initializeSocket() {
    // Kết nối tới signaling server
    socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Đã kết nối tới signaling server');
    });

    // Nhận danh sách người dùng trực tuyến
    socket.on('users-online', (users) => {
        console.log('Danh sách người dùng:', users);
        updateOnlineUsersList(users);
    });

    // Xử lý khi có người dùng mới
    socket.on('user-connected', (user) => {
        console.log('Người dùng mới:', user);
        if (user.peerId !== peer.id) {
            updateOnlineUsersList(user);
        }
    });

    // Xử lý khi người dùng ngắt kết nối
    socket.on('user-disconnected', (userId) => {
        console.log('Người dùng ngắt kết nối:', userId);
        removeOnlineUser(userId);
    });
}

function login() {
    const username = document.getElementById('username').value;
    if (!username) return alert('Vui lòng nhập tên!');
    
    currentUsername = username;
    console.log('Đang kết nối với username:', username);
    
    // Khởi tạo PeerJS
    peer = new Peer(`${username}-${Date.now()}`, {
        host: '0.peerjs.com',
        port: 443,
        secure: true,
        debug: 2,
        config: {
            'iceServers': [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        console.log('Kết nối thành công với ID:', id);
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'flex';
        
        // Thông báo cho signaling server
        socket.emit('user-login', {
            username: currentUsername,
            peerId: id
        });
    });
    
    peer.on('connection', handleNewConnection);
    
    peer.on('error', (err) => {
        console.error('Lỗi PeerJS:', err);
        if (err.type !== 'peer-unavailable') {
            alert('Có lỗi xảy ra: ' + err.message);
        }
    });

    // Khởi tạo kết nối socket
    initializeSocket();
}

function handleNewConnection(conn) {
    console.log('Kết nối mới từ:', conn.peer);
    connections[conn.peer] = conn;
    
    conn.on('data', (data) => {
        console.log('Nhận data:', data);
        if (data.type === 'file-info') {
            // Khởi tạo object lưu trữ chunks
            fileChunks[data.fileId] = {
                chunks: new Array(data.totalChunks),
                info: data,
                receivedChunks: 0
            };
            // Hiển thị progress bar cho người nhận
            displayFileProgress(conn.peer, data.fileId, data.fileName, 0);
            
        } else if (data.type === 'file-chunk') {
            handleFileChunk(data, conn.peer);
            
        } else if (data.type === 'message') {
            // Tạo đối tượng tin nhắn
            const message = {
                sender: data.username,
                content: data.content,
                timestamp: data.timestamp,
                isSent: false
            };
            
            // Lưu tin nhắn vào history
            if (!messageHistory[conn.peer]) {
                messageHistory[conn.peer] = [];
            }
            messageHistory[conn.peer].push(message);
            
            // Nếu không phải chat đang active, tăng số tin nhắn chưa đọc
            if (activeChat !== conn.peer) {
                unreadMessages[conn.peer] = (unreadMessages[conn.peer] || 0) + 1;
                updateUnreadBadge(conn.peer);
            }
            
            // Hiển thị tin nhắn nếu đang trong chat với người gửi
            if (activeChat === conn.peer) {
                displayMessage(conn.peer, message);
            }
        }
    });
    
    conn.on('close', () => {
        console.log('Ngắt kết nối với:', conn.peer);
        delete connections[conn.peer];
    });
}

function updateOnlineUsersList(users) {
    const onlineUsersDiv = document.getElementById('online-users');
    
    // Nếu users là mảng (danh sách đầy đủ)
    if (Array.isArray(users)) {
        onlineUsersDiv.innerHTML = ''; // Xóa danh sách cũ
        users.forEach(user => {
            if (user.peerId !== peer.id) {
                addUserToList(user);
            }
        });
    } 
    // Nếu users là một user duy nhất (người dùng mới)
    else if (users.peerId !== peer.id) {
        // Kiểm tra xem user đã tồn tại chưa
        const existingUser = onlineUsersDiv.querySelector(`[data-peer-id="${users.peerId}"]`);
        if (!existingUser) {
            addUserToList(users);
        }
    }
}

function addUserToList(user) {
    const onlineUsersDiv = document.getElementById('online-users');
    const userElement = document.createElement('div');
    userElement.className = 'online-user';
    userElement.setAttribute('data-peer-id', user.peerId);
    
    // Thêm chấm xanh
    const statusDot = document.createElement('span');
    statusDot.className = 'online-status';
    userElement.appendChild(statusDot);
    
    // Thêm tên người dùng
    const usernameSpan = document.createElement('span');
    usernameSpan.className = 'username';
    usernameSpan.textContent = user.username;
    userElement.appendChild(usernameSpan);
    
    // Thêm badge nếu có tin nhắn chưa đọc
    if (unreadMessages[user.peerId] && unreadMessages[user.peerId] > 0) {
        const badge = document.createElement('span');
        badge.className = 'unread-badge';
        badge.textContent = unreadMessages[user.peerId];
        userElement.appendChild(badge);
    }
    
    userElement.onclick = () => connectToUser(user.peerId, user.username);
    onlineUsersDiv.appendChild(userElement);
}

function removeOnlineUser(userId) {
    const userElement = document.querySelector(`[data-peer-id="${userId}"]`);
    if (userElement) {
        userElement.remove();
    }
}

function connectToUser(peerId, username) {
    if (peerId === peer.id) return;
    
    document.querySelectorAll('.online-user').forEach(el => {
        el.classList.remove('active');
    });
    
    const userElement = document.querySelector(`[data-peer-id="${peerId}"]`);
    if (userElement) {
        userElement.classList.add('active');
    }
    
    selectedUser = peerId;
    document.getElementById('no-chat-selected').style.display = 'none';
    
    // Hiển thị tất cả tin nhắn khi mở chat
    showChatContainer(peerId, username);
    
    // Reset số tin nhắn chưa đọc
    unreadMessages[peerId] = 0;
    updateUnreadBadge(peerId);
    
    // Hiển thị tất cả tin nhắn từ history
    if (messageHistory[peerId]) {
        const messagesDiv = document.getElementById(`messages-${peerId}`);
        messagesDiv.innerHTML = ''; // Xóa tin nhắn hiện tại
        messageHistory[peerId].forEach(message => {
            displayMessage(peerId, message);
        });
    }
    
    if (!connections[peerId]) {
        const conn = peer.connect(peerId);
        conn.on('open', () => {
            handleNewConnection(conn);
        });
    }
}

function showChatContainer(peerId, username) {
    // Ẩn thông báo "Chọn một người để bắt đầu chat"
    document.getElementById('no-chat-selected').style.display = 'none';
    
    // Kiểm tra xem đã có container chưa
    if (!chatContainers[peerId]) {
        const container = document.createElement('div');
        container.className = 'chat-container';
        container.id = `chat-${peerId}`;
        container.innerHTML = `
            <div id="chat-header">
                <span class="chat-username">${username}</span>
            </div>
            <div class="messages" id="messages-${peerId}"></div>
            <div class="message-input">
                <input type="file" id="file-input-${peerId}" style="display: none">
                <button class="file-btn" onclick="document.getElementById('file-input-${peerId}').click()">
                    <i class="fas fa-paperclip"></i>
                </button>
                <input type="text" 
                    id="message-text-${peerId}" 
                    placeholder="Nhập tin nhắn..."
                    onkeypress="if(event.key === 'Enter') sendMessage('${peerId}')">
                <button onclick="sendMessage('${peerId}')">Gửi</button>
            </div>
        `;
        
        document.getElementById('chat-containers').appendChild(container);
        chatContainers[peerId] = container;
        
        // Thêm event listener cho file input
        const fileInput = document.getElementById(`file-input-${peerId}`);
        fileInput.addEventListener('change', () => handleFileSelect(peerId));
    }

    // Ẩn tất cả các chat container khác
    Object.values(chatContainers).forEach(container => {
        container.classList.remove('active');
    });

    // Hiển thị chat container hiện tại
    chatContainers[peerId].classList.add('active');
    activeChat = peerId;

    // Load tin nhắn cũ nếu có
    if (messageHistory[peerId]) {
        const messagesDiv = document.getElementById(`messages-${peerId}`);
        messagesDiv.innerHTML = ''; // Xóa tin nhắn hiện tại
        messageHistory[peerId].forEach(message => {
            displayMessage(peerId, message);
        });
    }
}

function sendMessage(peerId) {
    if (!peerId) return;
    
    const messageInput = document.getElementById(`message-text-${peerId}`);
    const messageText = messageInput.value;
    
    if (!messageText) return;
    
    const conn = connections[peerId];
    if (conn) {
        // Tạo object tin nhắn
        const message = {
            sender: currentUsername,
            content: messageText,
            timestamp: new Date().getTime(),
            isSent: true
        };

        // Gửi tin nhắn cho người nhận
        conn.send({
            type: 'message',
            username: currentUsername,
            content: messageText,
            timestamp: message.timestamp
        });

        // Lưu tin nhắn vào history
        if (!messageHistory[peerId]) {
            messageHistory[peerId] = [];
        }
        messageHistory[peerId].push(message);

        // Hiển thị tin nhắn
        displayMessage(peerId, message);
        messageInput.value = '';
    }
}

function displayMessage(peerId, message) {
    const messagesDiv = document.getElementById(`messages-${peerId}`);
    if (!messagesDiv) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.isSent ? 'sent' : 'received'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message.content;
    
    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    messageTime.textContent = new Date(message.timestamp).toLocaleTimeString();
    
    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTime);
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleMessageKeyPress(event, peerId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage(peerId);
    }
}

// Thêm hàm mới để cập nhật badge
function updateUnreadBadge(peerId) {
    const userElement = document.querySelector(`[data-peer-id="${peerId}"]`);
    if (!userElement) return;

    // Xóa badge cũ nếu có
    const existingBadge = userElement.querySelector('.unread-badge');
    if (existingBadge) {
        existingBadge.remove();
    }

    // Thêm badge mới nếu có tin nhắn chưa đọc
    if (unreadMessages[peerId] && unreadMessages[peerId] > 0) {
        const badge = document.createElement('span');
        badge.className = 'unread-badge';
        badge.textContent = unreadMessages[peerId];
        userElement.appendChild(badge);
    }
}

// Hàm xử lý khi chọn file
async function handleFileSelect(peerId) {
    const fileInput = document.getElementById(`file-input-${peerId}`);
    const file = fileInput.files[0];
    if (!file) return;
    
    // Tạo ID duy nhất cho file
    const fileId = `${Date.now()}-${file.name}`;
    
    try {
        // Hiển thị progress bar
        displayFileProgress(peerId, fileId, file.name, 0);
        
        // Gửi file
        await sendFileInChunks(file, peerId, fileId);
        
        console.log('File sent successfully');
    } catch (error) {
        console.error('Error sending file:', error);
        alert('Có lỗi xảy ra khi gửi file. Vui lòng thử lại.');
        removeFileProgress(peerId, fileId);
    }
    
    fileInput.value = ''; // Reset input
}

// Hàm chia và gửi file
async function sendFileInChunks(file, peerId, fileId) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const conn = connections[peerId];
    
    // Gửi thông tin file
    conn.send({
        type: 'file-info',
        fileId: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        totalChunks: totalChunks,
        timestamp: Date.now()
    });
    
    // Đọc và gửi từng chunk
    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        
        // Đọc chunk thành ArrayBuffer
        const arrayBuffer = await chunk.arrayBuffer();
        
        // Gửi chunk
        conn.send({
            type: 'file-chunk',
            fileId: fileId,
            chunkIndex: i,
            data: arrayBuffer
        });
        
        // Cập nhật tiến trình
        const progress = ((i + 1) / totalChunks) * 100;
        updateFileProgress(peerId, fileId, progress);
        
        // Đợi một chút để tránh quá tải
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}

// Hàm xử lý từng chunk file nhận được
function handleFileChunk(data, peerId) {
    const { fileId, chunkIndex, data: chunkData } = data;
    const fileData = fileChunks[fileId];
    
    if (!fileData) return;
    
    // Lưu chunk
    fileData.chunks[chunkIndex] = chunkData;
    fileData.receivedChunks++;
    
    // Cập nhật tiến trình
    const progress = (fileData.receivedChunks / fileData.info.totalChunks) * 100;
    updateFileProgress(peerId, fileId, progress);
    
    // Kiểm tra nếu đã nhận đủ chunks
    if (fileData.receivedChunks === fileData.info.totalChunks) {
        assembleAndDisplayFile(fileId, peerId);
        
        // Cập nhật số tin nhắn chưa đọc
        if (activeChat !== peerId) {
            unreadMessages[peerId] = (unreadMessages[peerId] || 0) + 1;
            updateUnreadBadge(peerId);
        }
    }
}

// Hàm ghép file và hiển thị
async function assembleAndDisplayFile(fileId, peerId) {
    const fileData = fileChunks[fileId];
    const blob = new Blob(fileData.chunks, { type: fileData.info.fileType });
    
    // Chuyển blob thành URL
    const url = URL.createObjectURL(blob);
    
    // Hiển thị file
    displayFile(peerId, {
        name: fileData.info.fileName,
        size: fileData.info.fileSize,
        type: fileData.info.fileType,
        url: url,
        timestamp: fileData.info.timestamp,
        isSent: false
    });
    
    // Xóa progress bar và dọn dẹp
    removeFileProgress(peerId, fileId);
    delete fileChunks[fileId];
}

// Cập nhật hàm displayFile để hỗ trợ preview
async function displayFile(peerId, fileData) {
    const messagesDiv = document.getElementById(`messages-${peerId}`);
    const messageElement = document.createElement('div');
    messageElement.className = `message file ${fileData.isSent ? 'sent' : 'received'}`;
    
    // Tạo preview dựa vào loại file
    let previewHTML = '';
    let iconClass = 'fas fa-file';
    const fileExtension = fileData.name.split('.').pop().toLowerCase();
    
    if (fileData.type.startsWith('image/')) {
        // Preview cho ảnh
        previewHTML = `
            <div class="file-preview">
                <img src="${fileData.url}" class="image-preview" alt="${fileData.name}">
            </div>`;
        iconClass = 'fas fa-file-image';
    } 
    else if (fileData.type.startsWith('video/')) {
        // Preview cho video
        previewHTML = `
            <div class="file-preview">
                <video class="video-preview" controls>
                    <source src="${fileData.url}" type="${fileData.type}">
                </video>
            </div>`;
        iconClass = 'fas fa-file-video';
    }
    else if (fileData.type.startsWith('audio/')) {
        // Preview cho audio
        previewHTML = `
            <div class="file-preview">
                <audio controls>
                    <source src="${fileData.url}" type="${fileData.type}">
                </audio>
            </div>`;
        iconClass = 'fas fa-file-audio';
    }
    else {
        // Preview mặc định cho các file khác
        iconClass = getFileIcon(fileExtension);
        previewHTML = `
            <div class="file-preview file-preview-default">
                <i class="${iconClass} file-icon-large"></i>
                <div class="file-extension">${fileExtension}</div>
            </div>`;
    }
    
    const downloadLink = document.createElement('a');
    downloadLink.href = fileData.url;
    downloadLink.download = fileData.name;
    downloadLink.innerHTML = `
        ${previewHTML}
        <div class="file-info">
            <span class="file-name">${fileData.name}</span>
            <span class="file-size">${formatFileSize(fileData.size)}</span>
        </div>
    `;
    
    messageElement.appendChild(downloadLink);
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Cập nhật số tin nhắn chưa đọc nếu không phải người gửi
    if (!fileData.isSent && activeChat !== peerId) {
        unreadMessages[peerId] = (unreadMessages[peerId] || 0) + 1;
        updateUnreadBadge(peerId);
    }
}

// Hàm lấy icon dựa vào phần mở rộng của file
function getFileIcon(extension) {
    const iconMap = {
        // Documents
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'ppt': 'fas fa-file-powerpoint',
        'pptx': 'fas fa-file-powerpoint',
        'txt': 'fas fa-file-alt',
        
        // Archives
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        '7z': 'fas fa-file-archive',
        
        // Code
        'html': 'fas fa-file-code',
        'css': 'fas fa-file-code',
        'js': 'fas fa-file-code',
        'json': 'fas fa-file-code',
        'php': 'fas fa-file-code',
        'py': 'fas fa-file-code',
        
        // Images
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'svg': 'fas fa-file-image',
        
        // Audio
        'mp3': 'fas fa-file-audio',
        'wav': 'fas fa-file-audio',
        'ogg': 'fas fa-file-audio',
        
        // Video
        'mp4': 'fas fa-file-video',
        'avi': 'fas fa-file-video',
        'mkv': 'fas fa-file-video',
        'mov': 'fas fa-file-video'
    };
    
    return iconMap[extension.toLowerCase()] || 'fas fa-file';
}

// Các hàm tiện ích
function formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function displayFileProgress(peerId, fileId, fileName, progress) {
    const messagesDiv = document.getElementById(`messages-${peerId}`);
    const progressElement = document.createElement('div');
    progressElement.id = `progress-${fileId}`;
    progressElement.className = 'file-progress';
    progressElement.innerHTML = `
        <div class="file-progress-info">
            <span class="file-name">${fileName}</span>
            <span class="progress-text">${progress.toFixed(1)}%</span>
        </div>
        <div class="progress-bar">
            <div class="progress" style="width: ${progress}%"></div>
        </div>
    `;
    messagesDiv.appendChild(progressElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function updateFileProgress(peerId, fileId, progress) {
    const progressElement = document.getElementById(`progress-${fileId}`);
    if (progressElement) {
        const progressBar = progressElement.querySelector('.progress');
        const progressText = progressElement.querySelector('.progress-text');
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress.toFixed(1)}%`;
    }
}

function removeFileProgress(peerId, fileId) {
    const progressElement = document.getElementById(`progress-${fileId}`);
    if (progressElement) {
        progressElement.remove();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-text');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                login();
            }
        });
    }
}); 