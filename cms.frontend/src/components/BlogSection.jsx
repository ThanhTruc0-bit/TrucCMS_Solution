import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function BlogSection() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(
                "https://localhost:7194/api/Posts"
            );
            const data = await res.json();

            // lấy 3 bài mới nhất
            setPosts(data.slice(0, 3));
        } catch (error) {
            console.log("Lỗi load blog:", error);
        }
    };

    return (
        <div style={styles.wrap}>
            <h2 style={styles.title}>
                FASHION INSIGHTS
            </h2>

            <div style={styles.grid}>
                {posts.map((p) => (
                    <div key={p.id} style={styles.card}>

                        {/* IMAGE */}
                        <img
                            src={BASE + p.imageUrl}
                            style={styles.img}
                        />

                        {/* TITLE */}
                        <h4 style={styles.name}>
                            <Link to={`/post/${p.id}`} style={styles.link}>
                                {p.title}
                            </Link>
                        </h4>

                    </div>
                ))}
            </div>
        </div>
    );
}

/* STYLE */
const styles = {
    wrap: {
        marginTop: 80,
        padding: "60px 80px",
        background: "#fff"
    },

    title: {
        textAlign: "center",
        marginBottom: 40,
        fontSize: 26,
        letterSpacing: 2
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 30
    },

    card: {
        border: "1px solid #eee",
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        transition: "0.3s"
    },

    img: {
        width: "100%",
        height: 200,
        objectFit: "cover"
    },

    name: {
        padding: 15,
        fontSize: 15,
        textAlign: "center"
    },

    link: {
        textDecoration: "none",
        color: "#111"
    }
};