/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
export default function PostCard(props) {
    return (
        <div style={{
            border: "1px solid #ccc",
            padding: 10,
            width: 250,
            margin: 10
        }}>
            <img src={props.image} width="100%" />

            <h3>{props.title}</h3>

            <p>{props.content}</p>
        </div>
    );
}
