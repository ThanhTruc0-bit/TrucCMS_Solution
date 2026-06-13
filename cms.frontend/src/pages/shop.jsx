import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Shop() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const keyword = query.get("keyword") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [keyword]);

    const fetchProducts = async () => {
        setLoading(true);

        try {
            const url = keyword
                ? `${BASE}/api/products/search?keyword=${keyword}`
                : `${BASE}/api/products`;

            const res = await fetch(url);
            const data = await res.json();

            setProducts(data);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    const highlightText = (text, keyword) => {
        if (!keyword) return text;

        const parts = text.split(new RegExp(`(${keyword})`, "gi"));

        return parts.map((part, i) =>
            part.toLowerCase() === keyword.toLowerCase() ? (
                <span key={i} style={styles.highlight}>
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <div style={styles.page}>

            {/* HEADER TITLE */}
            <div style={styles.header}>
                <h1>CỬA HÀNG</h1>
                {keyword && <p>Kết quả cho: <b>{keyword}</b></p>}
            </div>

            {/* LOADING */}
            {loading && <p>Đang tải sản phẩm...</p>}

            {/* GRID */}
            <div style={styles.grid}>
                {products.map((p) => (
                    <div
                        key={p.id}
                        style={styles.card}
                        onClick={() => navigate(`/product/${p.id}`)}
                    >

                        <div style={styles.imgBox}>
                            <img
                                src={BASE + p.imageUrl}
                                style={styles.img}
                            />
                        </div>

                        <h3 style={styles.name}>
                            {highlightText(p.name, keyword)}
                        </h3>

                        <p style={styles.price}>
                            {p.price.toLocaleString()} đ
                        </p>

                        <button style={styles.btn}>
                            Xem chi tiết
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
}
const styles = {
    page: {
        padding: "80px 10%",
        fontFamily: "serif",
        background: "#fafafa"
    },

    header: {
        textAlign: "center",
        marginBottom: 40
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 25
    },

    card: {
        background: "#fff",
        borderRadius: 14,
        padding: 15,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        cursor: "pointer",
        transition: "0.3s",
    },

    imgBox: {
        overflow: "hidden",
        borderRadius: 10
    },

    img: {
        width: "100%",
        height: 200,
        objectFit: "cover",
        transition: "0.4s"
    },

    name: {
        fontSize: 16,
        marginTop: 10
    },

    price: {
        color: "#bfa14a",
        fontWeight: "bold",
        marginTop: 5
    },

    btn: {
        marginTop: 10,
        width: "100%",
        padding: 10,
        border: "none",
        background: "linear-gradient(135deg,#c9a96e,#bfa14a)",
        color: "#fff",
        borderRadius: 20,
        cursor: "pointer"
    },

    highlight: {
        background: "#ffe08a",
        fontWeight: "bold",
        padding: "2px 4px",
        borderRadius: 4
    }
};