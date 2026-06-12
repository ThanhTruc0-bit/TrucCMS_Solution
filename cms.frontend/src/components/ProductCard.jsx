import { Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function ProductCard({ id, name, price, imageUrl }) {
    return (
        <div style={styles.card}>

            {/* IMAGE */}
            <div style={styles.imgWrap}>
                <img
                    src={BASE + imageUrl}
                    style={styles.img}
                />
            </div>

            {/* CONTENT */}
            <div style={styles.body}>
                <h4 style={styles.name}>{name}</h4>

                <div style={styles.price}>
                    {price?.toLocaleString()} đ
                </div>

                <Link to={`/product/${id}`}>
                    <button style={styles.btn}>
                        Xem chi tiết
                    </button>
                </Link>
            </div>

        </div>
    );
}

/* STYLE */
const styles = {
    card: {
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid #eee",
        transition: "0.3s"
    },

    imgWrap: {
        overflow: "hidden"
    },

    img: {
        width: "100%",
        height: 260,
        objectFit: "cover",
        transition: "0.4s"
    },

    body: {
        padding: 15,
        textAlign: "center"
    },

    name: {
        fontSize: 15,
        marginBottom: 10,
        minHeight: 40
    },

    price: {
        color: "#c9a96e", // vàng luxury
        fontWeight: "bold",
        marginBottom: 15
    },

    btn: {
        padding: "8px 18px",
        borderRadius: 30,
        border: "1px solid #111",
        background: "transparent",
        cursor: "pointer"
    }
};