import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function HotProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchHotProducts();
    }, []);

    const fetchHotProducts = async () => {
        try {
            const res = await fetch(`${BASE}/api/Products/hot`);
            const data = await res.json();

            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={styles.wrapper}>

            <h2 style={styles.title}>
                🔥 SẢN PHẨM BÁN CHẠY
            </h2>

            <div style={styles.grid}>

                {products.map((p) => (
                    <div key={p.id} style={styles.card}>

                        {/* IMAGE */}
                        <div style={styles.imgWrap}>
                            <img
                                src={BASE + p.imageUrl}
                                alt={p.name}
                                style={styles.img}
                            />
                        </div>

                        {/* CONTENT */}
                        <div style={styles.body}>
                            <h4 style={styles.name}>{p.name}</h4>

                            <div style={styles.price}>
                                {p.price?.toLocaleString()} đ
                            </div>

                            <span style={styles.badge}>
                                🔥 Bán chạy
                            </span>

                            <div style={styles.btnGroup}>

                                <Link to={`/product/${p.id}`}>
                                    <button style={styles.detailBtn}>
                                        Xem chi tiết
                                    </button>
                                </Link>

                                <button style={styles.buyBtn}>
                                    Mua ngay
                                </button>

                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
}
const styles = {
    wrapper: {
        marginTop: 60,
        padding: "0 80px"
    },

    title: {
        textAlign: "center",
        fontSize: 26,
        marginBottom: 30,
        fontWeight: "600"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 25
    },

    card: {
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #eee",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
    },

    imgWrap: {
        overflow: "hidden",
        background: "#fafafa"
    },

    img: {
        width: "100%",
        height: 260,
        objectFit: "cover"
    },

    body: {
        padding: 15,
        textAlign: "center"
    },

    name: {
        fontSize: 15,
        marginBottom: 8,
        minHeight: 40,
        fontWeight: "600"
    },

    price: {
        color: "#c9a96e",
        fontWeight: "bold",
        marginBottom: 10
    },

    badge: {
        display: "inline-block",
        background: "#ff4d4f",
        color: "#fff",
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 12,
        marginBottom: 10
    },

    btnGroup: {
        display: "flex",
        gap: 10,
        justifyContent: "center"
    },

    detailBtn: {
        padding: "8px 14px",
        borderRadius: 20,
        border: "1px solid #111",
        background: "#fff",
        cursor: "pointer",
        fontSize: 13
    },

    buyBtn: {
        padding: "8px 14px",
        borderRadius: 20,
        border: "none",
        background: "#c9a96e",
        color: "#fff",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: "bold"
    }
};