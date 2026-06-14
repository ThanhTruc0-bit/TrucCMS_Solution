import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function OrderSuccess() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetch(`${BASE}/api/orders/${id}`)
            .then(res => res.json())
            .then(data => setOrder(data));
    }, [id]);

    if (!order) return <h2 style={{ textAlign: "center", marginTop: 100 }}>Loading...</h2>;

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h1 style={styles.title}>🎉 ORDER SUCCESS</h1>
                <p style={styles.id}>Mã đơn: #{order.id}</p>

                <div style={styles.divider}></div>

                {order.details.map((i, idx) => (
                    <div key={idx} style={styles.item}>
                        <span>SP #{i.productId}</span>
                        <span>x{i.quantity}</span>
                        <span>{i.unitPrice.toLocaleString()} đ</span>
                    </div>
                ))}

                <Link to="/" style={styles.btn}>
                    Về trang chủ
                </Link>

            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg,#111,#222)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "serif"
    },
    card: {
        width: 500,
        padding: 40,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(15px)",
        borderRadius: 20,
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)"
    },
    title: {
        color: "#bfa14a",
        letterSpacing: 2
    },
    id: {
        marginTop: 10,
        color: "#ccc"
    },
    divider: {
        height: 1,
        background: "rgba(255,255,255,0.2)",
        margin: "20px 0"
    },
    item: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 10
    },
    btn: {
        display: "inline-block",
        marginTop: 25,
        padding: "12px 25px",
        background: "#bfa14a",
        color: "#111",
        borderRadius: 30,
        textDecoration: "none",
        fontWeight: "bold"
    }
};