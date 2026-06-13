import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/ApiService";

export default function PostDetail() {

    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await getPostById(id);
            setPost(data);
        } catch (error) {
            console.log("Lỗi:", error);
        }
    };

    if (!post) {
        return <p style={{ textAlign: "center" }}>Đang tải...</p>;
    }

    const BASE = "https://localhost:7194";

    return (
        <div style={styles.page}>

            {/* HERO */}
            <div style={styles.hero}>
                <img
                    src={BASE + post.imageUrl}
                    alt=""
                    style={styles.heroImg}
                />

                <div style={styles.overlay}>
                    <h1 style={styles.heroTitle}>
                        {post.title}
                    </h1>

                    <p style={{ color: "#ddd", marginTop: 10 }}>
                        Luxury Jewelry • {new Date().toLocaleDateString()}
                    </p>
                </div>

            </div>

            {/* CONTENT */}
            <div style={styles.container}>
                <div style={styles.content}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content
                        }}
                    />
                </div>
            </div>

        </div>
    );
}

/* ================= STYLE ================= */
const styles = {
    page: {
        fontFamily: "'Playfair Display', serif",
        backgroundColor: "#f8f8f8"
    },

    hero: {
        position: "relative",
        height: "420px",
        overflow: "hidden"
    },

    heroImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(65%)"
    },

    overlay: {
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
    },

    heroTitle: {
        color: "#fff",
        fontSize: "42px",
        letterSpacing: "3px",
        fontWeight: "500",
        maxWidth: "800px"
    },

    container: {
        maxWidth: "900px",
        margin: "60px auto",
        backgroundColor: "#fff",
        padding: "50px",
        borderRadius: "12px",
        boxShadow: "0 15px 40px rgba(0,0,0,0.06)"
    },

    content: {
        fontSize: "17px",
        lineHeight: "1.9",
        color: "#333"
    }
};