import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function CategoryMenu() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${BASE}/api/CategoriesProducts`);
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={styles.wrap}>
            {/* ALL */}
            <Link to="/shop" style={styles.item}>
                <div style={styles.circle}>
                    <img
                        src="https://via.placeholder.com/150"
                        style={styles.img}
                        alt="all"
                    />
                </div>
                <div style={styles.name}>ALL</div>
            </Link>

            {categories.map((c) => (
                <Link
                    key={c.id}
                    to={`/shop?categoryId=${c.id}&page=1`}
                    style={styles.item}
                >
                    <div style={styles.circle}>
                        <img
                            src={c.imageUrl ? BASE + c.imageUrl : "https://via.placeholder.com/150"}
                            alt={c.name}
                            style={styles.img}
                        />
                    </div>

                    <div style={styles.name}>{c.name}</div>
                </Link>
            ))}
        </div>
    );
}

const styles = {
    wrap: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
        gap: 20,
        justifyItems: "center",
        marginTop: 40,
        padding: "0 80px"
    },

    item: {
        textDecoration: "none",
        textAlign: "center",
        color: "#111"
    },

    circle: {
        width: 85,
        height: 85,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid #eee",
        boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff"
    },

    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
    },

    name: {
        fontSize: 13,
        fontWeight: "500"
    }
};