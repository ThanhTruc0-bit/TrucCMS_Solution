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
        fontFamily: "serif",
        backgroundColor: "#fafafa"
    },

    hero: {
        position: "relative",
        height: "400px",
        overflow: "hidden"
    },

    heroImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: "brightness(70%)"
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },

    heroTitle: {
        color: "#fff",
        fontSize: "38px",
        letterSpacing: "2px",
        textAlign: "center",
        maxWidth: "800px"
    },

    container: {
        maxWidth: "900px",
        margin: "60px auto",
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
    },

    content: {
        fontSize: "16px",
        lineHeight: "1.8",
        color: "#333"
    }
};