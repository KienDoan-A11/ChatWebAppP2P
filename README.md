# Định nghĩa và mô tả cơ bản về từng phần chính trong dự án web app chat và gửi dữ liệu P2P:

1. Back-end là gì?
Định nghĩa: Back-end là "bộ não" của ứng dụng, là nơi mà dữ liệu của tất cả người dùng được lưu trữ và xử lý. Nó giống như một quản lý lưu trữ và sắp xếp thông tin, đảm bảo rằng mọi người có thể gửi tin nhắn và dữ liệu tới đúng người khác.
Vai trò trong dự án: Thành viên này sẽ viết mã để lưu trữ và xử lý các tin nhắn của người dùng, quản lý dữ liệu khi người dùng đăng nhập, và cung cấp thông tin cho các phần khác của hệ thống.

2. Bảo mật & Xác thực là gì?
Định nghĩa: Bảo mật là việc giữ an toàn cho ứng dụng, đảm bảo rằng chỉ những người đã được xác minh (như có tài khoản đăng nhập) mới có thể sử dụng và xem thông tin trong ứng dụng. Xác thực là kiểm tra xem ai đó có đúng là người họ nói là không.
Vai trò trong dự án: Thành viên này sẽ giúp người dùng đăng nhập vào hệ thống một cách an toàn, không ai có thể xem tin nhắn hay thông tin riêng tư nếu họ không được xác thực đúng. Cũng như bảo vệ ứng dụng khỏi các cuộc tấn công từ bên ngoài.

3. Kết nối P2P là gì?
Định nghĩa: Kết nối P2P (peer-to-peer) là việc cho phép hai người dùng trong ứng dụng trò chuyện trực tiếp với nhau mà không cần thông qua một máy chủ trung gian. Hãy tưởng tượng như hai người nói chuyện qua điện thoại mà không cần đi qua tổng đài, chỉ cần kết nối thẳng với nhau.
Vai trò trong dự án: Thành viên này sẽ đảm bảo rằng khi một người dùng gửi tin nhắn hay dữ liệu, thông tin đó được chuyển trực tiếp tới người nhận mà không qua một trung gian nào, giúp việc gửi dữ liệu nhanh và an toàn hơn.

4. Front-end là gì?
Định nghĩa: Front-end là phần giao diện mà người dùng thấy và tương tác trực tiếp. Hãy tưởng tượng front-end như là mặt tiền của một cửa hàng, nơi mọi người có thể xem sản phẩm, nhấp vào các nút để thực hiện thao tác.
Vai trò trong dự án: Thành viên này sẽ thiết kế giao diện đẹp và dễ sử dụng cho ứng dụng, để người dùng có thể dễ dàng gửi tin nhắn, đăng nhập và xem những gì họ cần một cách dễ dàng.

5. Kiểm thử & Triển khai là gì?
Định nghĩa: Kiểm thử là quá trình kiểm tra xem ứng dụng có hoạt động đúng không, có lỗi hay không, và sửa các lỗi đó trước khi ứng dụng được đưa ra sử dụng. Triển khai là việc đưa ứng dụng từ môi trường phát triển lên mạng để mọi người có thể sử dụng.
Vai trò trong dự án: Thành viên này sẽ đảm bảo rằng ứng dụng không có lỗi và hoạt động trơn tru. Sau đó, họ sẽ đưa ứng dụng lên mạng để mọi người có thể truy cập và sử dụng từ bất cứ đâu.

Tổng kết dự án:
Xây dựng một ứng dụng web giúp mọi người có thể trò chuyện và chia sẻ dữ liệu với nhau.
Ứng dụng này có ba phần chính: bộ não (back-end) để xử lý dữ liệu, giao diện (front-end) mà người dùng thấy, và kết nối P2P giúp người dùng gửi dữ liệu trực tiếp cho nhau.
Để ứng dụng an toàn, cần bảo mật & xác thực để chỉ cho phép người đã đăng nhập được sử dụng.
Cuối cùng, cần kiểm thử để đảm bảo ứng dụng không có lỗi trước khi đưa nó lên mạng chot mọi người dùng.






# Distributed Computing (tính toán phân tán) 
Distributed Computing (tính toán phân tán) là mô hình tính toán trong đó các thành phần phần mềm và phần cứng phân tán trên nhiều máy tính khác nhau phối hợp với nhau để thực hiện các tác vụ. Hệ thống này có thể phân phối khối lượng công việc qua nhiều máy, làm tăng khả năng xử lý và hiệu suất.

Đặc điểm chính của Distributed Computing:
Phân tán: Công việc được chia nhỏ và thực hiện bởi nhiều máy tính khác nhau, có thể ở nhiều vị trí địa lý khác nhau.
Tính song song: Các tác vụ có thể được xử lý đồng thời, giúp tăng tốc độ xử lý.
Khả năng mở rộng: Dễ dàng thêm nhiều máy tính hơn để nâng cao hiệu suất.

# Tầm quan trọng của P2P trong Distributed Computing
Mô Ứng dụng của mạng P2P vào Distributed Computing:
Mạng P2P là một cơ chế phù hợp cho Distributed Computing, đặc biệt trong việc chia sẻ tài nguyên và phân tán công việc trên nhiều thiết bị. Dưới đây là một số cách mà P2P có thể hỗ trợ tính toán phân tán:

Chia sẻ tài nguyên: Trong mạng P2P, các thiết bị có thể chia sẻ tài nguyên như dung lượng lưu trữ, sức mạnh xử lý, hoặc dữ liệu. Điều này tương thích với mô hình Distributed Computing, nơi nhiều thiết bị đóng góp tài nguyên để xử lý các tác vụ lớn.
Phân tán khối lượng công việc: P2P có thể phân tán khối lượng công việc và dữ liệu trên nhiều thiết bị khác nhau, giảm áp lực lên một máy chủ duy nhất. Điều này giúp tăng tính linh hoạt và mở rộng của hệ thống tính toán phân tán.
Tính chịu lỗi cao: Mạng P2P có khả năng phục hồi tốt hơn nếu một số node (thiết bị) bị hỏng, do khối lượng công việc có thể được chuyển sang các peer khác. Điều này tăng độ tin cậy của hệ thống tính toán phân tán.




