import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { getPosts } from "../services/ApiService";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.log("Lỗi:", error);
        }
    };

    return (
        <div>
            <h1>Tin tức</h1>

            <div style={{ display: "flex" }}>
                {posts.map((p) => (
                    <PostCard
                        key={p.id}
                        id={p.id}
                        title={p.title}
                        image={p.imageUrl}
                        content={p.content}
                    />
                ))}
            </div>
        </div>
    );
}