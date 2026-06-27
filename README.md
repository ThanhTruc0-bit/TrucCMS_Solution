# Luxury Jewelry Website

Luxury Jewelry là website bán trang sức được xây dựng bằng ASP.NET Core MVC/Web API, ReactJS, SQL Server và Entity Framework Core. 
Website có các chức năng chính như xem danh sách sản phẩm, xem chi tiết sản phẩm, lọc sản phẩm theo danh mục, khoảng giá và từ khóa tìm kiếm, 
thêm sản phẩm vào giỏ hàng, đặt hàng, xem lịch sử đơn hàng, đăng ký, đăng nhập, xem bài viết blog và hiển thị nội dung HTML từ CKEditor.

# Cách chạy Backend

Để chạy Backend, mở project bằng Visual Studio, sau đó mở file TrucCMS_Solution.sln. 
Kiểm tra file appsettings.json để đảm bảo chuỗi kết nối SQL Server đã đúng với máy đang sử dụng.
Ví dụ chuỗi kết nối:
json
"ConnectionStrings": {
  "DefaultConnection": "Server=.\\SQLEXPRESS;Database=TrucCMS_DB;Trusted_Connection=True;TrustServerCertificate=True"
}
Sau khi kiểm tra xong, chọn project CMS.Backend làm Startup Project rồi nhấn F5 để chạy Backend. Backend sẽ chạy tại địa chỉ https://localhost:7194.

# Cách chạy Frontend

Để chạy Frontend, mở terminal tại thư mục ReactJS, sau đó chạy lệnh:
npm start
Frontend sẽ chạy tại địa chỉ http://localhost:3000.

Trong ReactJS, project sử dụng React Router nên dùng Link từ react-router-dom để điều hướng nội bộ giữa các trang, ví dụ:
<Link to="/shop">Shop</Link>
Không dùng thẻ:
html
<a href="/shop">Shop</a>
Lý do là `Link` giúp chuyển trang trong React mà không reload lại toàn bộ website.
Điều này giúp giữ lại state của ứng dụng như giỏ hàng, thông tin đăng nhập, bộ lọc sản phẩm và từ khóa tìm kiếm. 
Ngoài ra, `Link` giúp trải nghiệm người dùng mượt hơn và phù hợp với mô hình Single Page Application của React. 
Thẻ `a href` thường dùng để chuyển sang website bên ngoài hoặc reload lại trang, nên không phù hợp cho điều hướng nội bộ trong React Router.
