import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    };

    // ✅ FIX: KHÔNG mutate state
    const updateQty = (id, change) => {
        const newCart = cart
            .map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + change;
                    return {
                        ...item,
                        quantity: newQty < 1 ? 1 : newQty
                    };
                }
                return item;
            });

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };

    const getTotal = () => {
        return cart.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );
    };

    // ===== EMPTY =====
    if (cart.length === 0) {
        return (
            <div style={styles.emptyWrap}>
                <h2 style={styles.emptyTitle}>🛒 Giỏ hàng trống</h2>

                {/* ✅ DÙNG LINK */}
                <Link to="/" style={styles.backBtn}>
                    ← Tiếp tục mua sắm
                </Link>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <h1 style={styles.title}>GIỎ HÀNG CỦA BẠN</h1>

            <div style={styles.card}>

                {cart.map(item => (
                    <div key={item.id} style={styles.row}>

                        {/* IMAGE */}
                        <img
                            src={BASE + item.imageUrl}
                            style={styles.img}
                            alt={item.name}
                        />

                        {/* INFO */}
                        <div style={styles.info}>
                            <h3 style={styles.name}>{item.name}</h3>
                            <p style={styles.price}>
                                {item.price.toLocaleString()} đ
                            </p>

                            {/* QUANTITY */}
                            <div style={styles.qtyWrap}>
                                <button
                                    onClick={() => updateQty(item.id, -1)}
                                    style={styles.qtyBtn}
                                >
                                    -
                                </button>

                                <span style={styles.qtyText}>
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={() => updateQty(item.id, 1)}
                                    style={styles.qtyBtn}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* TOTAL */}
                        <div style={styles.total}>
                            {(item.price * item.quantity).toLocaleString()} đ
                        </div>

                        {/* REMOVE */}
                        <button
                            style={styles.remove}
                            onClick={() => removeItem(item.id)}
                        >
                            ✕
                        </button>

                    </div>
                ))}

            </div>

            {/* SUMMARY */}
            <div style={styles.summary}>
                <h2>
                    Tổng tiền: {getTotal().toLocaleString()} đ
                </h2>

                <button
                    style={styles.checkout}
                    onClick={() => navigate("/checkout")}
                >
                    Thanh toán ngay
                </button>
            </div>

        </div>
    );
}

const styles = {
    page: {
        padding: "60px 120px",
        background: "#f8f8f8",
        minHeight: "100vh",
        fontFamily: "serif"
    },

    title: {
        textAlign: "center",
        marginBottom: 40,
        letterSpacing: 3,
        fontSize: 28
    },

    card: {
        background: "#fff",
        borderRadius: 16,
        padding: 30,
        boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
    },

    row: {
        display: "flex",
        alignItems: "center",
        gap: 25,
        borderBottom: "1px solid #eee",
        padding: "20px 0"
    },

    img: {
        width: 110,
        height: 110,
        objectFit: "cover",
        borderRadius: 10
    },

    info: {
        flex: 1
    },

    name: {
        fontSize: 18,
        marginBottom: 6
    },

    price: {
        color: "#888"
    },

    qtyWrap: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 10
    },

    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "1px solid #ccc",
        background: "#fff",
        cursor: "pointer",
        fontSize: 18
    },

    qtyText: {
        minWidth: 20,
        textAlign: "center"
    },

    total: {
        width: 150,
        fontWeight: "bold",
        color: "#bfa14a",
        textAlign: "right"
    },

    remove: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "#999",
        fontSize: 18
    },

    summary: {
        marginTop: 40,
        textAlign: "right"
    },

    checkout: {
        marginTop: 10,
        padding: "14px 40px",
        background: "#bfa14a",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.3s"
    },

    emptyWrap: {
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        fontFamily: "serif"
    },

    emptyTitle: {
        fontSize: 24
    },

    backBtn: {
        padding: "12px 30px",
        borderRadius: 30,
        border: "1px solid #bfa14a",
        background: "transparent",
        color: "#bfa14a",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-block"
    }
};