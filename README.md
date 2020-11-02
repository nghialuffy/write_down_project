# Đề tài: Website writedown

- Mô tả: Xây dựng một website để mọi người có thể chia sẻ các kiến thức của mình. Đồng thời cũng là nơi để mọi người bình luận, chia sẻ ý kiến về các vấn đề trong cuộc sống.

## Họ và tên các thành viên trong nhóm

- Lê Văn Nghĩa (nhóm trưởng)

- Lê Văn Cần

- Nguyễn Thị Như Quyên

- Huỳnh Văn Hải

## Trang web: Tương  tự spiderum, reddit, medium

### So sánh ưu nhược điểm

#### Reddit

- Ưu điểm

  - Có thể đăng video, gif
  - Có thể tạo room để cùng thảo luận
  - Load thêm dữ liệu khi kéo thanh cuộn xuống, đơn giản những tốn nhiều phần cứng.
  - Định dạng văn bản phong phú, chi tiết.
  - Có thể report, hide, save bài viết.
  - Có thể đăng nhập, đăng ký bằng tài khoản Google, Apple.

- Nhược điểm:
  - Chủ đề bài viết không phân chia rõ.
  - UI phần viết bài tuy đầy đủ chức năng như rối mắt.

#### Spiderum

- Ưu điểm:
  - Phân chia bài viết theo các chủ đề, tag cụ thể, dễ phân loại, tìm kiếm.
  - Định dạng văn bản phong phú, chi tiết.
  - Có thể đăng nhập, đăng ký bằng tài khoản Facebook.
  - Những bài viết nổi bật được đưa lên đầu trang để người dùng đọc được những bài viết chất lượng.
  - Tự động lưu bài nháp.
- Nhược điểm:
  - Load dữ liệu theo kiểu phân trang, nhanh nhưng bất tiện.

#### Medium

- Ưu điểm:
  - Có phần recommend các bài viết cùng nội dung dưới bài viết chính.
  - Có thể đăng nhập, đăng ký bằng tài khoản Google, Apple, Facebook, Twitter, email.
  - Tự động lưu bài nháp.
- Nhược điểm:
  - UI nhìn rối mắt

## Các usecase đặc tả chức năng của website

Phân quyền người dùng:

- Admin ( Quản lý người dùng/ quản lý bài đăng)
    1. Hiển thị danh sách báo xấu
    2. Xóa bài đăng
    3. Khóa tài khoản
- User:
    1. Đăng ký
        1. Đăng ký bình thường
        2. Đăng ký bằng facebook
        3. Chọn chủ đề quan tâm
    2. Đăng nhập
        1. username & password
        2. Đăng nhập bằng facebook
    3. Đăng bài
        1. Định dạng bài đăng (tiny.cloud api/ tự lưu string(html))
        2. Đăng ảnh (url/ upload server trung gian -> url)
        3. Cho phép sao chép
        4. Hashtag
    4. Đọc bài
        1. DOM elements -> view html
        2. Upvote/Downvote
        3. Bình luận (Giống facebook)
        4. Chia sẻ trên facebook.
        5. Hiển thị thời gian đọc trung bình.
        6. Báo xấu
    5. Tìm kiếm bài:
        1. Theo Hashtag
        2. Theo tác giả
        3. Theo tiêu đề
        4. List bài đăng đang hot/ sôi nổi/ mới nhất/ Top
    6. Quản lý trang cá nhân
        1. Update thông tin ( tên hiển thị, email, password, avatar, bio, ảnh bìa, giới tính, ngày sinh...)
        2. Xem bài đăng của mình
        3. Xem nháp => Update bài đăng
        4. Thông báo:
        5. Dùng socketIO, API

## Công nghệ

- Database: MongoDB ( dùng online)
- Front-end: ReactJS, TypeScript.
- Back-end: Python (Flask)

## Công cụ

- Visual Studio Code

- NoSQLBooster

- PyCharm

## Task công việc

1. Tạo database (crawl data)
2. Viết usecase
3. Design
4. Thiết kế model dữ liệu trả về từ api
5. Thiết kế luồng dữ liệu
6. Xây dựng layout
7. Code
8. Testing

Link github: [https://github.com/nghialuffy/write_down_project](https://github.com/nghialuffy/write_down_project)
