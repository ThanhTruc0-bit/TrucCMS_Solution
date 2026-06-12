import { Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function PostCard({ id, title, imageUrl }) {
    return (
        <div style={styles.card}>

            <div style={styles.imgWrap}>
                <img src={BASE + imageUrl} style={styles.img} />
            </div>

            <div style={styles.body}>
                <h4 style={styles.title}>
                    <Link to={`/post/${id}`} style={styles.link}>
                        {title}
                    </Link>
                </h4>

                <button style={styles.btn}>
                    Xem chi tiết
                </button>
            </div>

        </div>
    );
}

/* 👇 PHẢI để dưới cùng file */
const styles = {
    card: {
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #eee"
    },

    imgWrap: {
        height: 260,
        overflow: "hidden"
    },

    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },

    body: {
        padding: 15,
        textAlign: "center"
    },

    title: {
        fontSize: 15,
        marginBottom: 10
    },

    link: {
        textDecoration: "none",
        color: "#111"
    },

    btn: {
        padding: "8px 16px",
        border: "1px solid #111",
        background: "#fff",
        cursor: "pointer",
        borderRadius: 20
    }
};