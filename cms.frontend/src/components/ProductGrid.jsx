import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";

const BASE = "https://localhost:7194";

export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || 1;
    const categoryId = searchParams.get("categoryId");

    useEffect(() => {
        fetchProducts();
    }, [page, categoryId]);

    const fetchProducts = async () => {
        try {
            let url = `${BASE}/api/Products/paging?page=${page}&pageSize=8`;

            // 👉 nếu có categoryId thì lọc
            if (categoryId) {
                url = `${BASE}/api/Products/category/${categoryId}`;
            }

            const res = await fetch(url);
            const result = await res.json();

            // paging trả {data}, category trả list
            const list = result.data || result;

            setProducts(Array.isArray(list) ? list : []);

        } catch (error) {
            console.log("Lỗi load sản phẩm:", error);
        }
    };

    return (
        <div style={styles.wrapper}>

            <h2 style={styles.title}>
                SẢN PHẨM NỔI BẬT
            </h2>

            <div style={styles.grid}>
                {products.map((p) => (
                    <ProductCard key={p.id} {...p} />
                ))}
            </div>

            {/* chỉ show paging khi KHÔNG filter category */}
            {!categoryId && (
                <div style={styles.paging}>
                    {page > 1 && (
                        <Link to={`/?page=${page - 1}`}>
                            <button style={styles.btn}>Prev</button>
                        </Link>
                    )}

                    <span style={styles.page}>Trang {page}</span>

                    <Link to={`/?page=${page + 1}`}>
                        <button style={styles.btn}>Next</button>
                    </Link>
                </div>
            )}

        </div>
    );
}

const styles = {
    wrapper: {
        marginTop: 80,
        padding: "0 80px"
    },

    title: {
        textAlign: "center",
        fontSize: 28,
        letterSpacing: 3,
        marginBottom: 40,
        fontWeight: "600"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 30
    },

    paging: {
        marginTop: 40,
        textAlign: "center"
    },

    btn: {
        padding: "8px 16px",
        border: "1px solid #111",
        background: "#fff",
        cursor: "pointer",
        margin: "0 10px"
    },

    page: {
        fontSize: 16
    }
};