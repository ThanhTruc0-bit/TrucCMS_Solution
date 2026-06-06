/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
import { useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
    const [posts, setPosts] = useState([
        {
            title: "Xu hướng 2026",
            image: "https://via.placeholder.com/150",
            content: "Thời trang mới nhất..."
        },
        {
            title: "Mix đồ đẹp",
            image: "https://via.placeholder.com/150",
            content: "Cách phối đồ..."
        },
        {
            title: "Mặc đẹp mỗi ngày",
            image: "https://via.placeholder.com/150",
            content: "Gợi ý outfit..."
        }
    ]);

    return (
        <div>
            <h1>Tin tức</h1>

            <div style={{ display: "flex" }}>
                {posts.map((p, index) => (
                    <PostCard
                        key={index}
                        title={p.title}
                        image={p.image}
                        content={p.content}
                    />
                ))}
            </div>
        </div>
    );
}