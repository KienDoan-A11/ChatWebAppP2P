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
là mô hình tính toán trong đó các thành phần phần mềm và phần cứng phân tán trên nhiều máy tính khác nhau phối hợp với nhau để thực hiện các tác vụ. Hệ thống này có thể phân phối khối lượng công việc qua nhiều máy, làm tăng khả năng xử lý và hiệu suất. là một phương thức tính toán phân tán, trong đó nhiều người dùng đóng góp tài nguyên của họ như sức mạnh xử lý, dung lượng lưu trữ, hoặc băng thông để thực hiện các nhiệm vụ tính toán lớn mà một hệ thống đơn lẻ không thể xử lý được. Tài nguyên đóng góp từ nhiều máy tính cá nhân hay máy chủ phân tán được tập hợp lại để giải quyết các vấn đề tính toán phức tạp hoặc xử lý lượng dữ liệu lớn. Những dự án nổi tiếng như SETI@home hay Folding@home là các ví dụ về contributed computing.

# Tầm quan trọng của P2P trong Distributed Computing
Mô hình P2P (Peer-to-Peer) đóng vai trò quan trọng trong contributed computing bởi vì:

Phân phối tài nguyên: Trong mô hình P2P, không có máy chủ trung tâm. Mỗi "peer" (máy tính tham gia) vừa có thể là người dùng vừa có thể là người cung cấp tài nguyên. Điều này giúp giảm gánh nặng lên máy chủ trung tâm và tối ưu hóa sử dụng tài nguyên.

Mở rộng quy mô dễ dàng: Khi nhiều thiết bị tham gia vào mạng P2P, sức mạnh tính toán và lưu trữ của hệ thống được tăng cường một cách dễ dàng mà không cần tăng cường cơ sở hạ tầng tập trung. Điều này rất quan trọng trong những hệ thống cần mở rộng nhanh chóng khi lượng công việc tăng cao.

Khả năng phục hồi cao: Do không có điểm trung tâm (central point of failure), mạng P2P có khả năng phục hồi tốt hơn trước các sự cố. Nếu một node bị hỏng hoặc bị mất kết nối, các node khác trong mạng vẫn tiếp tục hoạt động mà không ảnh hưởng đến hệ thống tổng thể.

Hiệu quả kinh tế: Thay vì cần các trung tâm dữ liệu lớn và tốn kém, contributed computing với mô hình P2P tận dụng tài nguyên của những máy tính có sẵn, giúp tiết kiệm chi phí triển khai hệ thống.

Ứng dụng trong chia sẻ dữ liệu: Mạng P2P không chỉ dùng cho tính toán mà còn hỗ trợ tốt cho việc chia sẻ dữ liệu trong các mạng phân tán, vì dữ liệu được phân phối trên nhiều node, giúp tăng tốc độ truyền tải và tính khả dụng.

P2P giúp cho mô hình contributed computing có khả năng mở rộng lớn hơn, mạnh mẽ hơn, và linh hoạt hơn trong việc tận dụng tài nguyên của các cá nhân hoặc tổ chức tham gia vào hệ thống.






