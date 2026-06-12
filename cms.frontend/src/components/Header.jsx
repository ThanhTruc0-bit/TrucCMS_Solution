import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div style={{ fontFamily: "serif" }}>

            {/* ===== TOP BAR ===== */}
            <div style={{
                background: "#f8f5f0",
                color: "#777",
                fontSize: 13,
                padding: "8px 60px",
                display: "flex",
                justifyContent: "space-between"
            }}>
                <div>
                    Hotline: 0909.xxx.xxx
                </div>

                <div>
                    <Link to="/login" style={topLink}>Đăng nhập</Link>
                    <Link to="/register" style={topLink}>Đăng ký</Link>
                </div>
            </div>

            {/* ===== MAIN HEADER ===== */}
            <div style={{
                background: "#ffffffcc",
                backdropFilter: "blur(10px)",
                padding: "18px 60px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
            }}>

                {/* LOGO */}
                <div style={{
                    fontSize: 26,
                    fontWeight: 600,
                    letterSpacing: 1,
                    color: "#bfa14a" // vàng luxury
                }}>
                    Luxury Jewelry
                </div>

                {/* SEARCH */}
                <div style={{
                    flex: 1,
                    margin: "0 60px",
                    display: "flex",
                    background: "#f9f9f9",
                    borderRadius: 30,
                    padding: "5px 10px",
                    boxShadow: "inset 0 1px 5px rgba(0,0,0,0.05)"
                }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm trang sức..."
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            padding: 10,
                            fontSize: 14
                        }}
                    />

                    <button style={{
                        background: "#bfa14a",
                        border: "none",
                        borderRadius: 20,
                        padding: "8px 15px",
                        color: "#fff",
                        cursor: "pointer"
                    }}>
                        🔍
                    </button>
                </div>

                {/* CART */}
                <div style={{
                    position: "relative",
                    fontSize: 20,
                    cursor: "pointer"
                }}>
                    🛍️
                    <span style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        background: "#bfa14a",
                        color: "#fff",
                        fontSize: 11,
                        borderRadius: "50%",
                        padding: "3px 6px"
                    }}>
                        2
                    </span>
                </div>

            </div>

            {/* ===== MENU ===== */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                padding: "15px 0",
                background: "#fff"
            }}>
                <Link to="/" style={menuLink}>Trang chủ</Link>
                <Link to="/shop" style={menuLink}>Cửa hàng</Link>
                <Link to="/blog" style={menuLink}>Tin tức</Link>
                <Link to="/about" style={menuLink}>Về chúng tôi</Link>
            </div>

        </div>
    );
}

const topLink = {
    marginLeft: 15,
    textDecoration: "none",
    color: "#777"
};

const menuLink = {
    textDecoration: "none",
    color: "#333",
    fontWeight: 500,
    letterSpacing: 1
};