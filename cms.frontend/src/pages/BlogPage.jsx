import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${BASE}/api/Posts`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Load blog error:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={styles.loading}>
                Đang tải tin tức...
            </div>
        );
    }

    return (
        <div style={styles.wrap}>

            {/* HEADER TOP */}
            <div style={styles.topBar}>

                <h1 style={styles.title}>
                    📰 TIN TỨC & XU HƯỚNG
                </h1>

                <button
                    onClick={() => navigate("/")}
                    style={styles.backBtn}
                >
                    ← Quay về trang chủ
                </button>

            </div>

            {/* GRID */}
            <div style={styles.grid}>

                {posts.map(post => (
                    <div key={post.id} style={styles.card}>

                        <Link to={`/post/${post.id}`}>
                            <div style={styles.imgWrap}>
                                <img
                                    src={`${BASE}${post.imageUrl}`}
                                    alt={post.title}
                                    style={styles.img}
                                />
                            </div>
                        </Link>

                        <div style={styles.body}>

                            <div style={styles.metaTop}>
                                🗓 {new Date(post.createdAt).toLocaleDateString()}
                            </div>

                            <Link to={`/post/${post.id}`} style={styles.link}>
                                <h3 style={styles.name}>
                                    {post.title}
                                </h3>
                            </Link>

                            <p style={styles.desc}>
                                {post.content?.slice(0, 120)}...
                            </p>

                            <Link to={`/post/${post.id}`} style={styles.readMore}>
                                Đọc thêm →
                            </Link>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}

/* STYLE */
const styles = {

    wrap: {
        padding: "60px 80px",
        background: "#f6f6f6",
        minHeight: "100vh",
        fontFamily: "serif"
    },

    loading: {
        padding: 80,
        textAlign: "center",
        fontSize: 18
    },

    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40
    },

    title: {
        fontSize: 32,
        fontWeight: "bold",
        letterSpacing: 1
    },

    backBtn: {
        padding: "10px 18px",
        border: "1px solid #111",
        background: "transparent",
        borderRadius: 30,
        cursor: "pointer",
        transition: "0.3s"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 30
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        transition: "0.3s"
    },

    imgWrap: {
        overflow: "hidden"
    },

    img: {
        width: "100%",
        height: 230,
        objectFit: "cover",
        transition: "0.4s"
    },

    body: {
        padding: 18
    },

    metaTop: {
        fontSize: 12,
        color: "#999",
        marginBottom: 8
    },

    name: {
        fontSize: 18,
        marginBottom: 10,
        color: "#111"
    },

    desc: {
        fontSize: 13,
        color: "#666",
        lineHeight: 1.5,
        marginBottom: 15
    },

    readMore: {
        fontSize: 13,
        color: "#bfa14a",
        textDecoration: "none",
        fontWeight: "bold"
    },

    link: {
        textDecoration: "none"
    }
};