# Đưa portfolio lên GitHub Pages

## 1. Chọn địa chỉ website

Với tài khoản GitHub hiện tại của bạn:

| Mục | Giá trị |
| --- | --- |
| Chủ sở hữu | `nguyenducminh-cloud` |
| Repository website cá nhân | `nguyenducminh-cloud.github.io` |
| Địa chỉ website | `https://nguyenducminh-cloud.github.io/` |

Muốn dùng `https://minhnguyen.github.io/`, bạn phải sở hữu tài khoản hoặc tổ chức `minhnguyen`, rồi tạo repository `minhnguyen.github.io` dưới tài khoản/tổ chức đó. Gói website không kiểm tra tên này còn trống và không đổi tên tài khoản cho bạn.

Nếu dùng repository tên khác, ví dụ `portfolio`, GitHub Pages thường phục vụ tại `https://nguyenducminh-cloud.github.io/portfolio/`. Mã nguồn sử dụng đường dẫn tương đối để hỗ trợ cách này.

## 2. Upload mã nguồn

1. Tải và giải nén gói portfolio.
2. Đăng nhập GitHub, mở repository `nguyenducminh-cloud.github.io`. Nếu chưa có, tạo repository public với tên này.
3. Chọn **Add file → Upload files**.
4. Kéo **các file và thư mục bên trong gói đã giải nén** vào vùng upload.
5. Nhập commit message, ví dụ `Add portfolio website`, rồi chọn **Commit changes** vào nhánh `main`.

Sau khi upload, trang Code của repository phải hiển thị `index.html`, `assets`, `personal`, `experience`, `blog`, `contact` và `studio` ngay ở cấp gốc.

**Không upload nguyên ZIP. Không tạo thêm một cấp thư mục `portfolio/` bên ngoài các file này.**

GitHub giới hạn upload qua trình duyệt ở 25 MiB mỗi file và tối đa 100 file mỗi đợt. Nếu có nhiều file hơn, chia thành nhiều đợt hoặc dùng Git. Giữ nguyên tên và cấu trúc thư mục. Nếu hệ điều hành ẩn `.nojekyll` và `.github`, bật hiển thị file ẩn để copy chúng; cách deploy từ nhánh vẫn dùng được nếu bạn chưa upload workflow tùy chọn.

Website cũ có thể còn một số file không được dùng. Gói mới có đường dẫn `background/` để giữ tương thích với liên kết cũ và dẫn sang Experience. Hãy giữ bản sao repository trước khi tự xóa các file cũ.

## 3. Bật Pages bằng nhánh main

1. Trong repository, mở **Settings**.
2. Chọn **Pages** ở thanh bên.
3. Trong **Build and deployment**, chọn **Source → Deploy from a branch**.
4. Chọn **Branch → main** và thư mục **/(root)**.
5. Bấm **Save**.
6. Chờ tác vụ Pages hoàn tất. Trang Settings → Pages sẽ hiển thị URL khi website sẵn sàng; bạn cũng có thể xem tiến trình trong tab **Actions**.

Không cần chạy `npm install` hoặc build trước khi upload. File `.nojekyll` yêu cầu GitHub phục vụ nội dung tĩnh trực tiếp.

Nếu nhánh chính của repository tên là `master` thay vì `main`, chọn nhánh thực sự chứa mã nguồn. Không chọn `/docs` vì website này nằm ở thư mục gốc.

## 4. Kiểm tra sau khi xuất bản

- Mở Dashboard và kiểm tra avatar, biểu tượng tab, logo website.
- Mở trực tiếp `/personal/`, `/experience/`, `/blog/` và `/contact/` bằng URL.
- Kiểm tra giao diện ở điện thoại và máy tính.
- Bấm tải CV và xác nhận đúng file.
- Thử form liên hệ; ứng dụng email phải mở với người nhận và nội dung được điền sẵn.
- Kiểm tra email, đường dẫn GitHub và toàn bộ thông tin trước khi chia sẻ website.

Nếu chưa thấy thay đổi, chờ tác vụ Pages hoàn tất rồi tải lại trang bằng `Ctrl+F5`. Nếu ảnh không hiện, kiểm tra tên file có khớp chữ hoa/chữ thường với đường dẫn trong mã nguồn không.

## 5. Cập nhật hồ sơ và blog

### Hồ sơ, timeline, kỹ năng

Sửa `assets/js/profile.js` và commit. GitHub Pages sẽ cập nhật theo nguồn xuất bản đang dùng. File khai báo biến `window.PORTFOLIO_CONFIG`; giữ nguyên cấu trúc dữ liệu và dấu ngoặc.

### Bài blog

1. Mở `/studio/` và viết bài.
2. Lưu nháp trong trình duyệt, xem trước bài, rồi xuất `posts.js`.
3. Xuất thêm JSON để giữ bản sao dự phòng.
4. Trên GitHub, mở thư mục `assets/js/` và upload file `posts.js` mới vào đúng vị trí, thay phiên bản cũ.
5. Commit rồi chờ Pages cập nhật.

File `posts.js` chứa **toàn bộ danh sách bài viết**. Khi thay file, những bài không có trong file mới sẽ không còn xuất hiện trên blog. Lưu nháp trong Studio chỉ lưu trên thiết bị/trình duyệt đó; nó không commit và không đăng bài trực tiếp lên GitHub.

### CV và ảnh

Thay đúng file trong `assets/files/` hoặc `assets/images/`. Nếu thay tên file, cập nhật đường dẫn tham chiếu. Nội dung CV và mọi file đưa lên website đều có thể được người truy cập tải xuống.

## Tùy chọn: deploy bằng GitHub Actions

Bạn có thể dùng workflow `.github/workflows/pages.yml` có sẵn thay cho cách deploy từ nhánh. Chỉ cần chọn một nguồn xuất bản cho repository.

1. Upload cả `.github/workflows/pages.yml` lên repository.
2. Mở **Settings → Pages → Source → GitHub Actions**.
3. Mở **Actions → Deploy portfolio to GitHub Pages**.
4. Chọn **Run workflow**, chọn nhánh chứa website và xác nhận chạy.
5. Chờ job deploy hoàn tất; GitHub hiển thị URL ở deployment environment `github-pages`.

Workflow được cấu hình **chạy thủ công**. Sau mỗi lần cập nhật hồ sơ hoặc blog, bạn cần bấm **Run workflow** để triển khai phiên bản mới. Khi dùng cách **Deploy from a branch**, bạn không cần chạy workflow này.

Workflow chỉ copy website và tài nguyên cần phục vụ vào `_site`, sau đó upload và deploy. README và hướng dẫn deploy không được copy vào bản triển khai Actions.

## Các giới hạn cần biết

GitHub Pages phục vụ HTML, CSS, JavaScript và tài nguyên tĩnh. Các tương tác của portfolio hoạt động trong trình duyệt, không có database hoặc máy chủ nhận email. Form liên hệ dùng `mailto:` và Studio xuất file để bạn đăng qua GitHub. Không đặt token GitHub hoặc mật khẩu trong mã nguồn để cố bật chức năng đăng bài trực tiếp.

## Tài liệu GitHub chính thức

- [Tên repository và URL GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Tạo website GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Chọn nhánh hoặc Actions làm nguồn xuất bản](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Upload file bằng trình duyệt](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Workflow tùy chỉnh cho GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)


## Bản nháp trong file xuất

Writing Studio xuất cả bài có sẵn trên website, **tất cả bản nháp đã lưu và form hiện tại**. Chỉ upload file khi toàn bộ các bài trong đó đều sẵn sàng công khai. Có thể giữ nội dung chưa hoàn thiện trong bản sao JSON riêng, rồi xóa bản nháp đó khỏi trình soạn trước khi xuất file đăng. Xóa bản nháp cục bộ không xóa bài đã có trong `assets/js/posts.js`; muốn xóa bài đã đăng, xóa đối tượng bài đó trong file này rồi commit.
