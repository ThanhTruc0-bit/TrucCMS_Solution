import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Shop() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);

    const page = parseInt(query.get("page")) || 1;
    const categoryId = query.get("categoryId");
    const sort = query.get("sort");

    const [products, setProducts] = useState([]);

    const [minPriceInput, setMinPriceInput] = useState("");
    const [maxPriceInput, setMaxPriceInput] = useState("");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // debounce min/max
    useEffect(() => {
        const timer = setTimeout(() => {
            setMinPrice(minPriceInput);
            setMaxPrice(maxPriceInput);
        }, 400);

        return () => clearTimeout(timer);
    }, [minPriceInput, maxPriceInput]);

    useEffect(() => {
        fetchProducts();
    }, [page, categoryId, sort, minPrice, maxPrice]);

    const fetchProducts = async () => {
        let url = `${BASE}/api/products/shop?page=${page}&pageSize=8`;

        if (categoryId) url += `&categoryId=${categoryId}`;
        if (sort) url += `&sort=${sort}`;

        // FIX QUAN TRỌNG
        if (minPrice !== "") url += `&minPrice=${minPrice}`;
        if (maxPrice !== "") url += `&maxPrice=${maxPrice}`;

        const res = await fetch(url);

        if (!res.ok) {
            console.log("API ERROR:", await res.text());
            return;
        }
        const data = await res.json();

        setProducts(Array.isArray(data.data) ? data.data : []);
    };

    const changePage = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set("page", newPage);
        navigate(`/shop?${params.toString()}`);
    };

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <Link to="/" style={styles.backBtn}>
                    ← Home
                </Link>

                <div style={styles.rightBox}>

                    <select
                        style={styles.select}
                        onChange={(e) => {
                            const params = new URLSearchParams(location.search);
                            params.set("sort", e.target.value);
                            params.set("page", 1);
                            navigate(`/shop?${params.toString()}`);
                        }}
                    >
                        <option value="">Mặc định</option>
                        <option value="newest">Mới nhất</option>
                        <option value="price_asc">Giá tăng</option>
                        <option value="price_desc">Giá giảm</option>
                        <option value="best">Bán chạy</option>
                    </select>

                    {/* MIN PRICE */}
                    <input
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        style={styles.input}
                    />

                    {/* MAX PRICE */}
                    <input
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        style={styles.input}
                    />

                </div>
            </div>

            {/* GRID */}
            <div style={styles.grid}>
                {products.map((p) => (
                    <div
                        key={p.id}
                        style={styles.card}
                        onClick={() => navigate(`/product/${p.id}`)}
                    >
                        <img
                            src={BASE + p.imageUrl}
                            style={styles.img}
                            alt=""
                        />

                        <div style={styles.info}>
                            <div style={styles.name}>{p.name}</div>
                            <div style={styles.price}>
                                {p.price.toLocaleString()} ₫
                            </div>
                            <div style={styles.sold}>
                                Đã bán {p.soldQuantity || 0}
                            </div>
                        </div>

                        {p.soldQuantity > 5 && (
                            <div style={styles.hot}>HOT</div>
                        )}
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div style={styles.pagination}>
                <button
                    disabled={page <= 1}
                    onClick={() => changePage(page - 1)}
                >
                    ←
                </button>

                <div>Trang {page}</div>

                <button onClick={() => changePage(page + 1)}>
                    →
                </button>
            </div>

        </div>
    );
}

/* STYLE GIỮ NGUYÊN */
const styles = {
    page: {
        padding: "50px 8%",
        background: "#f7f6f4",
        fontFamily: "serif"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30
    },
    backBtn: {
        textDecoration: "none",
        padding: "10px 18px",
        borderRadius: 999,
        border: "1px solid #111",
        color: "#111",
        background: "#fff"
    },
    rightBox: {
        display: "flex",
        gap: 10,
        alignItems: "center"
    },
    select: {
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd"
    },
    input: {
        width: 80,
        padding: "8px",
        borderRadius: 10,
        border: "1px solid #ddd"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 22
    },
    card: {
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)"
    },
    img: {
        width: "100%",
        height: 230,
        objectFit: "cover"
    },
    info: {
        padding: 14
    },
    name: {
        fontSize: 14,
        fontWeight: 600
    },
    price: {
        marginTop: 6,
        color: "#bfa14a",
        fontWeight: "bold"
    },
    sold: {
        fontSize: 12,
        color: "#888",
        marginTop: 4
    },
    hot: {
        position: "absolute",
        top: 10,
        left: 10,
        background: "#ff3b30",
        color: "#fff",
        fontSize: 11,
        padding: "3px 8px",
        borderRadius: 999
    },
    pagination: {
        marginTop: 35,
        display: "flex",
        justifyContent: "center",
        gap: 20
    }
};