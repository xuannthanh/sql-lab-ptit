# SQL Lab · PTIT

## Nguồn tổng hợp và ghi công

- **Đề bài, ảnh/sơ đồ, ví dụ và lời giải tham khảo:** [nvbangg/DBPTIT_CSDL](https://github.com/nvbangg/DBPTIT_CSDL).
- **Nguồn tổng hợp ban đầu được README repo trên ghi nhận:** [nvbangg/PTIT-Docs](https://github.com/nvbangg/PTIT-Docs).
- **Nền tảng bài tập được repo gốc dẫn tới:** [DBPTIT](https://db.ptit.edu.vn).

Website bổ sung giao diện luyện tập và môi trường chạy SQL trên trình duyệt. Nội dung đề và lời giải được ghi công cho các nguồn trên, không nhận là nội dung tự biên soạn. Đây là công cụ học tập độc lập, không phải website hay bộ chấm chính thức của PTIT.

Nội dung lấy từ commit [`8e7a048`](https://github.com/nvbangg/DBPTIT_CSDL/commit/8e7a0489fe869c4c94db16a5a17f4aa03db556cf) của repo nguồn.

Web luyện SQL tiếng Việt, không cần backend. Chạy cục bộ:

```powershell
cd dist
python -m http.server 5173 --bind 127.0.0.1
```

Mở http://127.0.0.1:5173. Cần dùng HTTP server thay vì mở index.html trực tiếp.

## Chức năng

- 175 đề gốc gồm ảnh/sơ đồ và 175 lời giải từ https://github.com/nvbangg/DBPTIT_CSDL.
- Tìm tên/mã bài không dấu, lọc độ khó, loại SQL, bài có ví dụ chấm và bài đã vượt ví dụ.
- Editor tự lưu theo bài, Ctrl+Enter chạy, tab dữ liệu, lời giải và lịch sử 20 lần gần nhất.
- Chạy thử trên dữ liệu đề hoặc dữ liệu CREATE TABLE / INSERT tự nhập.
- Chế độ **SQL tự do** trong thanh editor: chạy cả script CREATE / INSERT / UPDATE / DELETE / SELECT trên CSDL trống mỗi lần, hiển thị các tập kết quả. Nếu script không trả kết quả, hiển thị tối đa 200 dòng từ mỗi bảng.
- Web Worker tách biệt, giới hạn thời gian 5 giây và tối đa 10.000 dòng đầu ra.
- Nội dung bài tập chạy trong SQLite WASM; dữ liệu và code lưu tại trình duyệt thiết bị.

## Phạm vi chấm

Repository không chứa bộ test ẩn hoặc bộ chấm gốc. Web chỉ bật **Nộp ví dụ** cho 13 bài có input/output dạng văn bản, trích được dữ liệu và đã đối chiếu lời giải khớp output. Không so sánh chuỗi code với đáp án. So sánh số cột, dữ liệu, dòng lặp và thứ tự nếu lời giải yêu cầu ORDER BY; chấp nhận sai số số học nhỏ. Tên alias cột không được dùng làm điều kiện chấm.

Các bài khác có đủ đề/lời giải để học và nhập dữ liệu thử riêng; không hiển thị kết quả chấm giả. Dữ liệu tự nhập tắt chấm ví dụ. Có thể khôi phục dữ liệu gốc trong tab Dữ liệu.

**Engine SQLite không tương đương MySQL**. Một số hàm YEAR, MONTH, DAY, CONCAT, CHAR_LENGTH, IF và DATEDIFF được bổ sung; ALTER nâng cao, ENUM, PROCEDURE và nhiều cú pháp MySQL chưa được hỗ trợ. Vượt ví dụ không đồng nghĩa vượt test ẩn PTIT.

## Nguồn và thư viện

Nội dung: nvbangg/DBPTIT_CSDL, README ghi nguồn nvbangg/PTIT-Docs. Đây là công cụ học tập độc lập, không thuộc hệ thống chấm chính thức PTIT. Giữ nguyên lời giải tham khảo, kể cả trường hợp lời giải có thể sai hoặc dùng cú pháp khác.

SQL engine: sql.js 1.13.0 (MIT), SQLite WASM, các tệp runtime được lưu trong dist/vendor. Font Google Fonts có fallback hệ thống. Toàn bộ web tĩnh có thể triển khai từ dist/ lên một static hosting hỗ trợ WASM.
