Họ và tên các thành viên trong nhóm:
    + Lê Văn Nghĩa (nhóm trưởng)
    + Lê Văn Cần
    + Nguyễn Thị Như Quyên
    + Huỳnh Văn Hải
Đề tài: Website writedown 
    - Mô tả: Xây dựng một website để mọi người có thể chia sẻ các kiến thức của mình. Đồng thời cũng là nơi để mọi người bình luận, chia sẻ ý kiến về các vấn đề trong cuộc sống.


Trang web: Tương  tự spiderum, reddit, medium.
So sánh ưu nhược điểm:
    + Reddit:
         + Ưu điểm:
            - Có thể đăng video, gif.
            - Có thể tạo room để cùng thảo luận.
            - Load thêm dữ liệu khi kéo thanh cuộn xuống, đơn giản những tốn nhiều phần cứng.
            - Định dạng văn bản phong phú, chi tiết.
            - Có thể report, hide, save bài viết.
            - Có thể đăng nhập, đăng ký bằng tài khoản Google, Apple.
        + Nhược điểm:
            - Chủ đề bài viết không phân chia rõ.
            - UI phần viết bài tuy đầy đủ chức năng như rối mắt.
    + Spiderum:
        + Ưu điểm:
            - Phân chia bài viết theo các chủ đề, tag cụ thể, dễ phân loại, tìm kiếm.
            - Định dạng văn bản phong phú, chi tiết.
            - Có thể đăng nhập, đăng ký bằng tài khoản Facebook.
            - Những bài viết nổi bật được đưa lên đầu trang để người dùng đọc được những bài viết chất lượng.
            - Tự động lưu bài nháp.
        + Nhược điểm:
            - Load dữ liệu theo kiểu phân trang, nhanh nhưng bất tiện.
    + Medium:
        + Ưu điểm:
            - Có phần recommend các bài viết cùng nội dung dưới bài viết chính.
            - Có thể đăng nhập, đăng ký bằng tài khoản Google, Apple, Facebook, Twitter, email.
            - Tự động lưu bài nháp.
        + Nhược điểm:
            - UI nhìn rối mắt

Các usecase đặc tả chức năng của website:
Phân quyền người dùng:
-Admin ( Quản lý người dùng/ quản lý bài đăng)
    + Hiển thị danh sách báo xấu
    + Xóa bài đăng
    + Khóa tài khoản
-User:
    + Đăng ký
        + Đăng ký bình thường
        + Đăng ký bằng facebook
        + Chọn chủ đề quan tâm
    + Đăng nhập
     + username & password
     + Đăng nhập bằng facebook
    + Đăng bài
        + Định dạng bài đăng (tiny.cloud api/ tự lưu string(html))
        + Đăng ảnh (url/ upload server trung gian -> url)
        + Cho phép sao chép
        + Hashtag
    + Đọc bài
        + DOM elements -> view html
        + Upvote/Downvote
        + Bình luận (Giống facebook)
        + Chia sẻ trên facebook.
        + Hiển thị thời gian đọc trung bình.
     + Báo xấu
    + Tìm kiếm bài:
        + Theo Hashtag
        + Theo tác giả
        + Theo tiêu đề
        + List bài đăng đang hot/ sôi nổi/ mới nhất/ Top
    + Quản lý trang cá nhân
     + Update thông tin ( tên hiển thị, email, password, avatar, bio, ảnh bìa, giới tính, ngày sinh...)
     + Xem bài đăng của mình
     + Xem nháp => Update bài đăng
    + Thông báo:
     + Dùng socketIO, API

Công nghệ:
     + Database: MongoDB ( dùng online)
     + Front-end: ReactJS, TypeScript.
     + Back-end: Python (Flask)
Công cụ:
     + Visual Studio Code
     + NoSQLBooster
     + PyCharm
Task công việc:
     1. Tạo database (crawl data)
     2. Viết usecase
     3. Design
     4. Thiết kế model dữ liệu trả về từ api
     5. Thiết kế luồng dữ liệu
     6. Xây dựng layout
     7. Code
     8. Testing

Link github: https://github.com/nghialuffy/write_down_project
