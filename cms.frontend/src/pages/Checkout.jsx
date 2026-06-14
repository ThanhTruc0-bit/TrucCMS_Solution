import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: ""
    });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    }, []);

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const total = cart.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    const handleOrder = async () => {
        setError("");

        if (cart.length === 0) {
            setError("Giỏ hàng trống");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.customerId) {
            setError("Bạn chưa đăng nhập");
            return;
        }

        const orderData = {
            customerId: user.customerId,
            notes: `${form.fullName} | ${form.phone} | ${form.address} | ${form.note}`,
            items: cart.map(i => ({
                productId: i.id,
                quantity: i.quantity
            }))
        };

        try {
            setLoading(true);

            const res = await fetch(`${BASE}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đặt hàng thất bại");
                return;
            }

            localStorage.removeItem("cart");
            navigate(`/order-success/${data.orderId}`);

        } catch {
            setError("Lỗi server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>

                {/* LEFT */}
                <div style={styles.left}>
                    <h2 style={styles.title}>THÔNG TIN GIAO HÀNG</h2>

                    <input name="fullName" placeholder="Họ tên" onChange={handleChange} style={styles.input} />
                    <input name="phone" placeholder="Số điện thoại" onChange={handleChange} style={styles.input} />
                    <input name="address" placeholder="Địa chỉ" onChange={handleChange} style={styles.input} />
                    <textarea name="note" placeholder="Ghi chú" onChange={handleChange} style={styles.textarea} />

                    {error && <p style={styles.error}>{error}</p>}
                </div>

                {/* RIGHT */}
                <div style={styles.right}>
                    <h2 style={styles.title}>ĐƠN HÀNG</h2>

                    {cart.map((i, idx) => (
                        <div key={idx} style={styles.item}>
                            <div>
                                <p style={styles.product}>{i.name}</p>
                                <p style={styles.qty}>x{i.quantity}</p>
                            </div>
                            <p>{(i.price * i.quantity).toLocaleString()} đ</p>
                        </div>
                    ))}

                    <div style={styles.divider}></div>

                    <h3 style={styles.total}>
                        Tổng: {total.toLocaleString()} đ
                    </h3>

                    <button
                        onClick={handleOrder}
                        disabled={loading}
                        style={styles.button}
                    >
                        {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
                    </button>

                    <Link to="/cart" style={styles.back}>
                        ← Quay lại giỏ hàng
                    </Link>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#111,#1c1c1c)",
        padding: 60,
        fontFamily: "serif"
    },
    wrapper: {
        display: "flex",
        gap: 40
    },
    left: {
        flex: 1,
        background: "rgba(255,255,255,0.05)",
        padding: 40,
        borderRadius: 16,
        backdropFilter: "blur(12px)",
        color: "#fff"
    },
    right: {
        width: 420,
        background: "#fff",
        padding: 40,
        borderRadius: 16,
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
    },
    title: {
        marginBottom: 20,
        letterSpacing: 2
    },
    input: {
        width: "100%",
        padding: 14,
        marginBottom: 12,
        borderRadius: 10,
        border: "1px solid #333",
        background: "#000",
        color: "#fff"
    },
    textarea: {
        width: "100%",
        padding: 14,
        height: 90,
        borderRadius: 10,
        background: "#000",
        color: "#fff",
        border: "1px solid #333"
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 15
    },
    product: {
        fontWeight: "bold"
    },
    qty: {
        fontSize: 12,
        color: "#777"
    },
    divider: {
        height: 1,
        background: "#eee",
        margin: "20px 0"
    },
    total: {
        color: "#bfa14a"
    },
    button: {
        width: "100%",
        padding: 15,
        background: "#bfa14a",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        marginTop: 20,
        cursor: "pointer",
        fontWeight: "bold"
    },
    back: {
        display: "block",
        marginTop: 15,
        color: "#bfa14a",
        textDecoration: "none"
    },
    error: {
        color: "#ff6b6b",
        marginTop: 10
    }
};