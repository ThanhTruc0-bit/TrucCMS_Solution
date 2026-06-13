import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const updateQty = (id, change) => {
        const newCart = cart.map(item => {
            if (item.id === id) {
                item.quantity += change;
                if (item.quantity < 1) item.quantity = 1;
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

    if (cart.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: 100 }}>
                <h2>🛒 Giỏ hàng trống</h2>
                <button onClick={() => navigate("/")}>
                    Quay về mua sắm
                </button>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            <h1 style={styles.title}>GIỎ HÀNG</h1>

            <div style={styles.table}>
                {cart.map(item => (
                    <div key={item.id} style={styles.row}>

                        {/* IMAGE */}
                        <img
                            src={BASE + item.imageUrl}
                            style={styles.img}
                        />

                        {/* INFO */}
                        <div style={styles.info}>
                            <h3>{item.name}</h3>
                            <p>{item.price.toLocaleString()} đ</p>

                            <div style={styles.qtyWrap}>
                                <button onClick={() => updateQty(item.id, -1)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQty(item.id, 1)}>+</button>
                            </div>
                        </div>

                        {/* TOTAL */}
                        <div style={styles.total}>
                            {(item.price * item.quantity).toLocaleString()} đ
                        </div>

                        {/* DELETE */}
                        <button
                            style={styles.remove}
                            onClick={() => removeItem(item.id)}
                        >
                            ✕
                        </button>

                    </div>
                ))}
            </div>

            {/* TOTAL */}
            <div style={styles.summary}>
                <h2>
                    Tổng tiền: {getTotal().toLocaleString()} đ
                </h2>

                <button
                    style={styles.checkout}
                    onClick={() => navigate("/checkout")}
                >
                    Thanh toán
                </button>
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

    title: {
        textAlign: "center",
        marginBottom: 40
    },

    table: {
        background: "#fff",
        padding: 20,
        borderRadius: 10
    },

    row: {
        display: "flex",
        alignItems: "center",
        gap: 20,
        borderBottom: "1px solid #eee",
        padding: "20px 0"
    },

    img: {
        width: 100,
        height: 100,
        objectFit: "cover"
    },

    info: {
        flex: 1
    },

    qtyWrap: {
        display: "flex",
        gap: 10,
        marginTop: 10
    },

    total: {
        width: 120,
        fontWeight: "bold"
    },

    remove: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "red",
        fontSize: 18
    },

    summary: {
        marginTop: 40,
        textAlign: "right"
    },

    checkout: {
        padding: "12px 30px",
        background: "#c9a96e",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        cursor: "pointer"
    }
};