/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Banner quảng cáo trang chủ
*/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Advertisement
    {
        public int Id { get; set; }

        public string Title { get; set; }          // Tiêu đề banner

        public string ImageUrl { get; set; }       // Ảnh banner

        public string Description { get; set; }    // Mô tả ngắn

        public bool IsActive { get; set; }         // Hiển thị hay không
    }
}