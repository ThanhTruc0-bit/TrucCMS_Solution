import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
        note: "",
        paymentMethod: "COD"
    });

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(Array.isArray(data) ? data : []);
    }, []);

    const getTotal = () =>
        cart.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
        );

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (cart.length === 0) {
            alert("Giỏ hàng trống!");
            return;
        }

        const orderData = {
            ...form,
            total: getTotal(),
            items: cart.map(i => ({
                productId: i.id,
                quantity: i.quantity
            }))
        };

        try {
            const res = await fetch(`${BASE}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (res.ok) {
                alert("Đặt hàng thành công ✨");
                localStorage.removeItem("cart");
                navigate("/");
            } else {
                alert("Đặt hàng thất bại!");
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi server!");
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.header}>
                <h1>CHECKOUT</h1>
                <p>Thanh toán đơn hàng của bạn</p>
            </div>

            <div style={styles.container}>

                {/* LEFT */}
                <div style={styles.card}>
                    <h2 style={styles.title}>Thông tin giao hàng</h2>

                    <input name="fullName" placeholder="Họ và tên" onChange={handleChange} style={styles.input} />
                    <input name="phone" placeholder="Số điện thoại" onChange={handleChange} style={styles.input} />
                    <input name="address" placeholder="Địa chỉ nhận hàng" onChange={handleChange} style={styles.input} />

                    <textarea name="note" placeholder="Ghi chú" onChange={handleChange} style={styles.textarea} />

                    <select name="paymentMethod" onChange={handleChange} style={styles.input}>
                        <option value="COD">Thanh toán khi nhận hàng</option>
                        <option value="BANK">Chuyển khoản</option>
                    </select>
                </div>

                {/* RIGHT */}
                <div style={styles.summaryCard}>
                    <h2 style={styles.title}>Đơn hàng</h2>

                    {cart.map(item => (
                        <div key={item.id} style={styles.item}>
                            <div>
                                <div style={styles.itemName}>{item.name}</div>
                                <div style={styles.itemQty}>x{item.quantity}</div>
                            </div>

                            <div style={styles.price}>
                                {(item.price * item.quantity).toLocaleString()} đ
                            </div>
                        </div>
                    ))}

                    <div style={styles.divider}></div>

                    <div style={styles.totalRow}>
                        <span>Tổng</span>
                        <b style={styles.total}>{getTotal().toLocaleString()} đ</b>
                    </div>

                    <button onClick={handleSubmit} style={styles.button}>
                        XÁC NHẬN THANH TOÁN
                    </button>
                </div>

            </div>
        </div>
    );
}

const styles = {
    page: { padding: "80px 10%", background: "#fafafa", fontFamily: "serif" },
    header: { textAlign: "center", marginBottom: 50 },
    container: { display: "flex", gap: 40, alignItems: "flex-start" },
    card: { flex: 1, background: "#fff", padding: 40, borderRadius: 12 },
    summaryCard: { width: 380, background: "#fff", padding: 30, borderRadius: 12 },
    title: { fontSize: 20, marginBottom: 20 },
    input: { width: "100%", padding: 14, marginBottom: 15 },
    textarea: { width: "100%", padding: 14, minHeight: 80, marginBottom: 15 },
    item: { display: "flex", justifyContent: "space-between", marginBottom: 15 },
    itemName: { fontWeight: 500 },
    itemQty: { fontSize: 12, color: "#888" },
    price: { fontWeight: "bold", color: "#bfa14a" },
    divider: { height: 1, background: "#eee", margin: "20px 0" },
    totalRow: { display: "flex", justifyContent: "space-between" },
    total: { color: "#bfa14a" },
    button: {
        width: "100%",
        padding: 16,
        background: "#c9a96e",
        color: "#fff",
        border: "none",
        borderRadius: 30,
        cursor: "pointer"
    }
};