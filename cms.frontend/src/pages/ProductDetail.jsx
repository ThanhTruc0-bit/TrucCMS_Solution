import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${BASE}/api/Products/${id}`);
            const data = await res.json();
            setProduct(data);
        } catch (error) {
            console.log("Lỗi:", error);
        }
    };

    const increase = () => {
        if (qty < product.stockQuantity) setQty(qty + 1);
    };

    const decrease = () => {
        if (qty > 1) setQty(qty - 1);
    };

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find(x => x.id === product.id);

        if (exist) {
            exist.quantity += qty;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: qty
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        alert("🛒 Đã thêm vào giỏ hàng");
    };

    const buyNow = () => {
        addToCart();
        navigate("/checkout");
    };

    if (!product) {
        return <p style={{ textAlign: "center" }}>Đang tải...</p>;
    }

    return (
        <div style={styles.page}>

            {/* 🔙 BACK + BREADCRUMB */}
            <div style={styles.topBar}>

                <button onClick={() => navigate(-1)} style={styles.backBtn}>
                    ← Quay lại
                </button>

                <div style={styles.breadcrumb}>
                    <Link to="/">Trang chủ</Link>
                    <span>/</span>
                    <Link to="/shop">Sản phẩm</Link>
                    <span>/</span>
                    <span style={styles.current}>
                        {product.name}
                    </span>
                </div>

            </div>

            {/* MAIN */}
            <div style={styles.container}>

                {/* IMAGE */}
                <div style={styles.left}>
                    <div style={styles.imgWrap}>
                        <img
                            src={BASE + product.imageUrl}
                            style={styles.img}
                            alt=""
                        />
                    </div>
                </div>

                {/* INFO */}
                <div style={styles.right}>

                    <h1 style={styles.name}>
                        {product.name}
                    </h1>

                    <div style={styles.price}>
                        {product.price?.toLocaleString()} đ
                    </div>

                    <p style={styles.stock}>
                        Còn lại: {product.stockQuantity} sản phẩm
                    </p>

                    <p style={styles.desc}>
                        {product.description}
                    </p>

                    {/* QUANTITY */}
                    <div style={styles.qtyWrap}>
                        <button onClick={decrease} style={styles.qtyBtn}>-</button>
                        <span style={styles.qty}>{qty}</span>
                        <button onClick={increase} style={styles.qtyBtn}>+</button>
                    </div>

                    {/* ACTION */}
                    <div style={styles.actions}>
                        <button style={styles.addBtn} onClick={addToCart}>
                            🛒 Thêm vào giỏ
                        </button>

                        <button style={styles.buyBtn} onClick={buyNow}>
                            Mua ngay
                        </button>
                    </div>

                </div>

            </div>

        </div>
    );
}
const styles = {
    page: {
        padding: "60px 100px",
        fontFamily: "serif",
        background: "#fafafa"
    },

    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        paddingBottom: 10,
        borderBottom: "1px solid #eee"
    },

    backBtn: {
        border: "1px solid #ddd",
        padding: "6px 14px",
        borderRadius: 20,
        background: "#fff",
        cursor: "pointer",
        transition: "0.3s"
    },

    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        color: "#999"
    },

    current: {
        color: "#111",
        fontWeight: "500"
    },

    container: {
        display: "flex",
        gap: 60,
        background: "#fff",
        padding: 40,
        borderRadius: 15,
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
    },

    left: { flex: 1 },
    right: { flex: 1 },

    imgWrap: {
        overflow: "hidden",
        borderRadius: 12
    },

    img: {
        width: "100%",
        height: 450,
        objectFit: "cover",
        transition: "0.4s"
    },

    name: {
        fontSize: 30,
        marginBottom: 10,
        fontWeight: 600
    },

    price: {
        fontSize: 26,
        color: "#c9a96e",
        marginBottom: 15,
        fontWeight: "bold"
    },

    stock: {
        color: "#888",
        marginBottom: 20
    },

    desc: {
        lineHeight: 1.8,
        marginBottom: 30,
        color: "#444"
    },

    qtyWrap: {
        display: "flex",
        alignItems: "center",
        marginBottom: 30
    },

    qtyBtn: {
        width: 35,
        height: 35,
        border: "1px solid #ddd",
        background: "#fff",
        cursor: "pointer"
    },

    qty: {
        margin: "0 15px",
        fontSize: 18
    },

    actions: {
        display: "flex",
        gap: 15
    },

    addBtn: {
        padding: "12px 25px",
        background: "#111",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        cursor: "pointer"
    },

    buyBtn: {
        padding: "12px 25px",
        background: "#c9a96e",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        cursor: "pointer"
    }
};