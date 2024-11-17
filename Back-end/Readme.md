# Tính năng của Backend

Cấu hình Flask và Flask-SocketIO:
Sử dụng Flask để xây dựng ứng dụng web và Flask-SocketIO để hỗ trợ giao tiếp thời gian thực qua WebSocket.

API cho Gửi Tin Nhắn:
Endpoint: /api/messages (POST)
Cho phép client gửi tin nhắn.
Tin nhắn sẽ được phát đi đến tất cả các client đang kết nối.

API Lấy Danh Sách Người Dùng:
Endpoint: /api/users (GET)
Trả về danh sách người dùng giả lập. (phần này mở rộng sau nhé, trước mắt cứ thử nghiệm nếu chạy thành công thì sửa sau)

Kết nối WebSocket:
Thực hiện kết nối WebSocket để cho phép giao tiếp thời gian thực giữa client.
Hỗ trợ sự kiện khi client kết nối và ngắt kết nối, cùng với việc phát tin nhắn đến tất cả các client khi nhận được.

Mã hóa JWT (JSON Web Token):
Sử dụng JWT để bảo mật các endpoint, đảm bảo rằng chỉ những người dùng đã xác thực mới có thể truy cập vào một số chức năng của ứng dụng (nếu cần mở rộng, phần này ông Đức xem làm ntn nhé, đoạn này tôi bảo chat nó làm cũng chưa biết nó là cm gì đâu xD ).
