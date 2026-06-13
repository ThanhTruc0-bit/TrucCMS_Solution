import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [openUser, setOpenUser] = useState(false);

    const userRef = useRef();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // 🛒 CART COUNT
    useEffect(() => {
        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalQty);
        };

        updateCart();
        window.addEventListener("storage", updateCart);
        return () => window.removeEventListener("storage", updateCart);
    }, []);

    // 🔍 SEARCH
    const handleSearch = () => {
        if (!keyword.trim()) return;
        navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
    };

    // 👤 CLOSE OUTSIDE
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) {
                setOpenUser(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // 🚪 LOGOUT
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setOpenUser(false);
        navigate("/");
    };

    return (
        <div style={styles.wrapper}>

            {/* HEADER */}
            <div style={styles.header}>

                <Link to="/" style={styles.logo}>
                    Luxury Jewelry
                </Link>

                <div style={styles.searchBox}>
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Tìm kiếm trang sức..."
                        style={styles.input}
                    />

                    <button onClick={handleSearch} style={styles.searchBtn}>
                        🔍
                    </button>
                </div>

                {/* RIGHT */}
                <div style={styles.right}>

                    {/* USER */}
                    <div ref={userRef} style={{ position: "relative" }}>

                        <div
                            onClick={() => setOpenUser(!openUser)}
                            style={styles.userIcon}
                        >
                            👤
                        </div>

                        {openUser && (
                            <div style={styles.dropdown}>

                                {!token ? (
                                    <>
                                        <div style={styles.item} onClick={() => navigate("/login")}>
                                            🔑 Đăng nhập
                                        </div>

                                        <div style={styles.item} onClick={() => navigate("/register")}>
                                            ✨ Đăng ký
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={styles.item}>
                                            👤 {user?.name || "User"}
                                        </div>

                                        <div style={styles.item} onClick={handleLogout}>
                                            🚪 Đăng xuất
                                        </div>
                                    </>
                                )}

                            </div>
                        )}
                    </div>

                    {/* CART */}
                    <Link to="/cart" style={styles.cart}>
                        🛍️
                        {cartCount > 0 && (
                            <span style={styles.badge}>{cartCount}</span>
                        )}
                    </Link>

                </div>
            </div>

            {/* MENU */}
            <div style={styles.menu}>
                <Link to="/" style={styles.menuItem}>Trang chủ</Link>
                <Link to="/shop" style={styles.menuItem}>Cửa hàng</Link>
                <Link to="/blog" style={styles.menuItem}>Tin tức</Link>
                <Link to="/about" style={styles.menuItem}>Về chúng tôi</Link>
            </div>

        </div>
    );
}
const styles = {

    wrapper: {
        fontFamily: "serif",
        position: "sticky",
        top: 0,
        zIndex: 9999,
        background: "#fff"
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 60px",
        background: "#ffffffee",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eee"
    },

    logo: {
        fontSize: 26,
        fontWeight: 600,
        color: "#bfa14a",
        textDecoration: "none"
    },

    searchBox: {
        flex: 1,
        margin: "0 60px",
        display: "flex",
        background: "#f8f8f8",
        borderRadius: 30,
        padding: "6px 10px"
    },

    input: {
        flex: 1,
        border: "none",
        outline: "none",
        background: "transparent",
        padding: 10
    },

    searchBtn: {
        background: "#bfa14a",
        border: "none",
        borderRadius: 20,
        padding: "8px 15px",
        color: "#fff",
        cursor: "pointer"
    },

    right: {
        display: "flex",
        alignItems: "center",
        gap: 18
    },

    userIcon: {
        fontSize: 20,
        cursor: "pointer",
        padding: "8px 10px",
        borderRadius: 50,
        background: "#f5f5f5"
    },

    dropdown: {
        position: "absolute",
        right: 0,
        top: 45,
        width: 180,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
        overflow: "hidden"
    },

    dropdownHeader: {
        padding: "12px 14px",
        borderBottom: "1px solid #eee",
        background: "#fafafa"
    },

    item: {
        padding: "12px 14px",
        cursor: "pointer",
        fontSize: 14
    },

    cart: {
        position: "relative",
        fontSize: 20,
        textDecoration: "none"
    },

    badge: {
        position: "absolute",
        top: -6,
        right: -8,
        background: "#bfa14a",
        color: "#fff",
        fontSize: 11,
        borderRadius: "50%",
        padding: "3px 6px"
    },

    menu: {
        display: "flex",
        justifyContent: "center",
        gap: 40,
        padding: "14px 0",
        background: "#fff",
        borderBottom: "1px solid #eee"
    },

    menuItem: {
        textDecoration: "none",
        color: "#333",
        fontWeight: 500
    }
};