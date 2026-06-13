import { Link, useNavigate } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function ProductCard({ id, name, price, imageUrl }) {
    const navigate = useNavigate();

    const handleBuyNow = () => {
        const buyNowItem = {
            id,
            name,
            price,
            imageUrl,
            quantity: 1
        };

        // 👉 GHI VÀO CART để Checkout dùng được
        localStorage.setItem("cart", JSON.stringify([buyNowItem]));

        navigate("/checkout");
    };

    return (
        <div style={styles.card}>

            {/* IMAGE */}
            <div style={styles.imgWrap}>
                <img
                    src={BASE + imageUrl}
                    alt={name}
                    style={styles.img}
                />
            </div>

            {/* CONTENT */}
            <div style={styles.body}>
                <h4 style={styles.name}>{name}</h4>

                <div style={styles.price}>
                    {price?.toLocaleString()} đ
                </div>

                {/* BUTTON GROUP */}
                <div style={styles.btnGroup}>

                    <Link to={`/product/${id}`} style={{ textDecoration: "none" }}>
                        <button style={styles.detailBtn}>
                            Xem chi tiết
                        </button>
                    </Link>

                    <button onClick={handleBuyNow} style={styles.buyBtn}>
                        Mua ngay
                    </button>

                </div>
            </div>
        </div>
    );
}

/* STYLE GIỮ NGUYÊN */
const styles = {
    card: {
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #eee",
        transition: "0.3s",
        boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
    },
    imgWrap: { overflow: "hidden", background: "#fafafa" },
    img: { width: "100%", height: 260, objectFit: "cover", transition: "0.4s" },
    body: { padding: 15, textAlign: "center" },
    name: { fontSize: 15, marginBottom: 8, minHeight: 40, fontWeight: "600" },
    price: { color: "#c9a96e", fontWeight: "bold", marginBottom: 15 },
    btnGroup: { display: "flex", gap: 10, justifyContent: "center" },
    detailBtn: {
        padding: "8px 14px",
        borderRadius: 20,
        border: "1px solid #111",
        background: "transparent",
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