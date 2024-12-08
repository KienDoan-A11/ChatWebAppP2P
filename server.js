const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = new Map();

io.on('connection', (socket) => {
    console.log('Người dùng kết nối:', socket.id);

    // Gửi danh sách người dùng hiện tại
    socket.emit('users-online', Array.from(users.values()));

    // Xử lý đăng nhập
    socket.on('user-login', (user) => {
        console.log('Người dùng đăng nhập:', user);
        users.set(socket.id, {
            ...user,
            socketId: socket.id
        });
        
        // Thông báo cho tất cả người dùng khác
        socket.broadcast.emit('user-connected', user);
    });

    // Xử lý ngắt kết nối
    socket.on('disconnect', () => {
        console.log('Người dùng ngắt kết nối:', socket.id);
        const user = users.get(socket.id);
        if (user) {
            users.delete(socket.id);
            io.emit('user-disconnected', user.peerId);
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server đang chạy tại port ${PORT}`);
}); 