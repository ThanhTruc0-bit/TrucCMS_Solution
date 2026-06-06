import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPosts } from "../services/ApiService";

export default function PostDetail() {

    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        loadPost();
    }, []);

    const loadPost = async () => {
        const data = await getPosts(); // tạm lấy list
        const result = data.find(p => p.id == id);
        setPost(result);
    };

    if (!post) return <p>Đang tải...</p>;

    const BASE_URL = "https://localhost:7194";

    return (
        <div>
            <h1>{post.title}</h1>

            <img
                src={BASE_URL + post.imageUrl}
                width="400"
            />

            <p>{post.content}</p>
        </div>
    );
}