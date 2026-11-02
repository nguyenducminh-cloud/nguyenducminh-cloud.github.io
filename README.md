# Minh Nguyen · Portfolio

Portfolio nhiều trang, chạy trực tiếp trên GitHub Pages bằng HTML, CSS và JavaScript. Không cần cài Node.js, không cần build và không cần trả phí dịch vụ backend.

## Các trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Dashboard với avatar, phần giới thiệu và liên kết nhanh |
| `personal/` | Thông tin cá nhân, kỹ năng và sở thích |
| `experience/` | Timeline học tập, công việc và hoạt động tình nguyện |
| `blog/` | Danh sách bài viết và trang đọc bài |
| `contact/` | Thông tin liên hệ và soạn email |
| `studio/` | Soạn bài, xem trước, lưu nháp trong trình duyệt và xuất dữ liệu để đăng |

Website dùng liên kết tương đối để hoạt động ở cả tên miền gốc và đường dẫn repository. Các trang có thể mở trực tiếp bằng URL riêng.

## Đăng lên GitHub

Đọc [DEPLOY_GITHUB.md](DEPLOY_GITHUB.md) để thực hiện từng bước. Cách đơn giản nhất: **giải nén → upload nội dung thư mục → Settings → Pages → Deploy from a branch → main → /(root)**.

**Không upload nguyên file ZIP.** `index.html` phải nằm ở thư mục gốc của repository, không nằm trong một thư mục `portfolio/` lồng bên trong.

Với tài khoản `nguyenducminh-cloud`, repository website cá nhân là `nguyenducminh-cloud.github.io` và URL là `https://nguyenducminh-cloud.github.io/`.

Tên `https://minhnguyen.github.io/` chỉ dùng được khi bạn sở hữu tài khoản hoặc tổ chức GitHub có tên `minhnguyen`, cùng repository `minhnguyen.github.io`. Đổi riêng tên repository trên tài khoản hiện tại không tạo ra URL đó. Gói này không xác nhận tên tài khoản `minhnguyen` còn trống.

## Cấu trúc và chỗ cần sửa

```text
index.html
personal/index.html
experience/index.html
blog/index.html
contact/index.html
studio/index.html
assets/
  js/
    profile.js       ← Thông tin hồ sơ: window.PORTFOLIO_CONFIG
    posts.js         ← Nội dung blog: window.PORTFOLIO_POSTS
  images/            ← Avatar, biểu tượng và logo
  files/
    Mario_Nguyen.pdf ← CV tải xuống
.github/workflows/pages.yml
DEPLOY_GITHUB.md
```

- **Đổi nội dung hồ sơ:** sửa các giá trị trong `assets/js/profile.js`, giữ nguyên cấu trúc JavaScript. Kiểm tra lại tên, email, đường dẫn mạng xã hội và các mốc thời gian trước khi đăng công khai.
- **Đổi ảnh hoặc logo:** thay file tương ứng trong `assets/images/`; nếu đổi tên file, cập nhật luôn đường dẫn trong mã nguồn.
- **Đổi CV:** thay `assets/files/Mario_Nguyen.pdf`. CV tải xuống là file bạn đã cung cấp, nên mọi thông tin trong file sẽ được công khai khi website được đăng.
- **Đổi bài viết:** dùng Writing Studio hoặc sửa `assets/js/posts.js`.

Nội dung nghề nghiệp được tổng hợp từ CV bạn cung cấp. Khi CV và HTML cũ có mốc thời gian khác nhau, bản CV được ưu tiên. Các logo chỉ nhận diện những trường học và tổ chức trong hồ sơ; chúng không thể hiện sự bảo trợ hoặc chứng thực cho website.

## Viết và đăng blog

1. Mở `studio/` trên website bằng trình duyệt.
2. Soạn tiêu đề, nội dung và các thông tin bài viết; dùng chức năng xem trước để kiểm tra.
3. Lưu bản nháp nếu muốn tiếp tục viết sau.
4. Khi sẵn sàng, xuất `posts.js`. File xuất chứa bài có sẵn trên website, **tất cả bản nháp đã lưu và form đang mở**, không chỉ bài đang chỉnh sửa. Hãy bỏ các bản nháp chưa muốn đăng trước khi xuất; có thể giữ riêng chúng trong bản sao JSON.
5. Upload file vừa xuất để **thay thế `assets/js/posts.js`** trong repository GitHub, rồi commit.
6. Chờ GitHub Pages cập nhật và mở lại Blog để kiểm tra bài.

Xuất thêm bản sao JSON để giữ bản dự phòng hoặc chuyển dữ liệu giữa các trình duyệt theo chức năng của Studio.

**Nháp được lưu trên trình duyệt đang dùng.** Chúng không tự đồng bộ sang điện thoại hoặc máy tính khác, và có thể mất khi xóa dữ liệu website, dùng chế độ riêng tư hoặc đổi trình duyệt. Nút lưu nháp không đăng bài lên Internet. Writing Studio không có tài khoản quản trị hay mật khẩu; người truy cập có thể thử trình soạn thảo của riêng họ nhưng không thể thay đổi repository của bạn thông qua nó.

Không xóa các bài cũ khỏi file xuất nếu bạn vẫn muốn chúng tiếp tục xuất hiện trên blog. Trước khi thay `posts.js`, nên giữ lại bản cũ hoặc dùng lịch sử Git để khôi phục khi cần.

## Liên hệ và giới hạn chức năng

- Tương tác như chuyển trang, tìm kiếm/lọc, đổi giao diện và soạn bài chạy bằng JavaScript trong trình duyệt.
- Form liên hệ mở ứng dụng email qua `mailto:` với nội dung đã điền. Người dùng vẫn cần bấm gửi trong ứng dụng email; website không tự gửi hay lưu tin nhắn.
- GitHub Pages không cung cấp database hoặc chạy mã backend như PHP, Python và Ruby. Không có cơ chế đăng bài công khai tức thì từ Studio; xuất file và commit lên GitHub là bước đăng bài.
- Không đưa mật khẩu, GitHub personal access token, khóa API hoặc thông tin bí mật vào JavaScript. Mọi file của website công khai đều có thể được tải xuống.

## Xem thử trên máy

Cần Python 3. Mở terminal tại thư mục chứa `index.html` và chạy:

```bash
python3 -m http.server 8000
```

Trên Windows, có thể dùng:

```powershell
py -m http.server 8000
```

Mở `http://localhost:8000/`. Dừng server bằng `Ctrl+C`. Nên xem thử bằng địa chỉ này thay vì nhấp đúp file HTML để các tính năng trình duyệt hoạt động nhất quán.

## Nguồn hướng dẫn

- [GitHub Pages là gì?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Cấu hình nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Upload file vào repository](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Workflow GitHub Pages tùy chỉnh](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
