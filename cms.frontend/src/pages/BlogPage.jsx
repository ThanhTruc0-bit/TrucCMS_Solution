import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);

        fetch(`${BASE}/api/Posts/paging?page=${page}&pageSize=6`)
            .then(res => res.json())
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.log("Load blog error:", err);
                setLoading(false);
            });
    }, [page]);

    if (loading) {
        return <div style={styles.loading}>Đang tải tin tức...</div>;
    }

    return (
        <div style={styles.wrap}>

            {/* HEADER */}
            <div style={styles.topBar}>
                <h1 style={styles.title}>📰 TIN TỨC & XU HƯỚNG</h1>

                <button onClick={() => navigate("/")} style={styles.backBtn}>
                    ← Trang chủ
                </button>
            </div>

            {/* GRID */}
            <div style={styles.grid}>
                {posts.map(post => (
                    <div key={post.id} style={styles.card}>

                        {/* IMAGE */}
                        <Link to={`/post/${post.id}`}>
                            <img
                                src={BASE + post.imageUrl}   // ✅ FIX p → post
                                alt={post.title}
                                style={styles.img}
                                onError={(e) => e.target.src = "/no-image.jpg"}
                            />
                        </Link>

                        {/* CONTENT */}
                        <div style={styles.body}>

                            {/* DATE */}
                            <div style={styles.meta}>
                                🗓 {new Date(post.createdDate).toLocaleDateString()}
                            </div>

                            {/* TITLE */}
                            <Link to={`/post/${post.id}`} style={styles.link}>
                                <h3 style={styles.postTitle}>
                                    {post.title}
                                </h3>
                            </Link>

                            {/* CONTENT PREVIEW */}
                            <p style={styles.desc}>
                                {post.content
                                    ? post.content.slice(0, 100) + "..."
                                    : "Không có nội dung"}
                            </p>

                            {/* EXTRA INFO (API DATA) */}
                            <div style={styles.extra}>
                                📌 ID: {post.id}
                            </div>

                        </div>

                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div style={styles.pagination}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={styles.pageBtn}
                >
                    ← Trước
                </button>

                <span style={styles.pageText}>
                    Trang {page}
                </span>

                <button
                    onClick={() => setPage(page + 1)}
                    style={styles.pageBtn}
                >
                    Sau →
                </button>
            </div>

        </div>
    );
}

/* ================= STYLE ================= */
const styles = {
    wrap: {
        padding: "60px 80px",
        background: "#f6f6f6",
        minHeight: "100vh",
        fontFamily: "serif"
    },

    loading: {
        textAlign: "center",
        padding: 80,
        fontSize: 18
    },

    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40
    },

    title: {
        fontSize: 30,
        fontWeight: "bold"
    },

    backBtn: {
        padding: "10px 18px",
        border: "1px solid #111",
        background: "#fff",
        cursor: "pointer",
        borderRadius: 20
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 25
    },

    card: {
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
    },

    img: {
        width: "100%",
        height: 220,
        objectFit: "cover"
    },

    body: {
        padding: 15
    },

    meta: {
        fontSize: 12,
        color: "#999",
        marginBottom: 8
    },

    postTitle: {
        fontSize: 16,
        marginBottom: 10,
        color: "#111"
    },

    desc: {
        fontSize: 13,
        color: "#666",
        marginBottom: 10
    },

    extra: {
        fontSize: 12,
        color: "#bbb"
    },

    link: {
        textDecoration: "none"
    },

    pagination: {
        marginTop: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 20
    },

    pageBtn: {
        padding: "8px 16px",
        border: "1px solid #111",
        background: "#fff",
        cursor: "pointer"
    },

    pageText: {
        fontSize: 16
    }
};