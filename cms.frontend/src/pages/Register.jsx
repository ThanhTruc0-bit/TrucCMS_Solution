import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        fullName: "",
        passwordHash: "",
        email: "",
        phone: "",
        address: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async () => {
        if (!form.username || !form.fullName || !form.passwordHash) {
            alert("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            const res = await fetch(`${BASE}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                alert("Đăng ký thành công ✨");
                navigate("/login");
            } else {
                alert(data.message || "Đăng ký thất bại");
            }

        } catch (err) {
            console.log(err);
            alert("Lỗi server");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>

                <h1 style={styles.title}>CREATE ACCOUNT</h1>
                <p style={styles.sub}>Đăng ký tài khoản khách hàng</p>

                <input
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="fullName"
                    placeholder="Họ và tên"
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="passwordHash"
                    type="password"
                    placeholder="Mật khẩu"
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="phone"
                    placeholder="SĐT"
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="address"
                    placeholder="Địa chỉ"
                    onChange={handleChange}
                    style={styles.input}
                />

                <button onClick={handleRegister} style={styles.button}>
                    Đăng ký
                </button>

                <p style={styles.bottomText}>
                    Đã có tài khoản?{" "}
                    <Link to="/login" style={styles.link}>
                        Đăng nhập
                    </Link>
                </p>

            </div>
        </div>
    );
}

const styles = {
    page: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #111, #222)"
    },

    card: {
        width: 420,
        padding: 40,
        borderRadius: 16,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(15px)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        color: "#fff",
        textAlign: "center"
    },

    title: {
        marginBottom: 5,
        letterSpacing: 2,
        fontSize: 26,
        color: "#d6b25e"
    },

    sub: {
        marginBottom: 25,
        fontSize: 13,
        color: "#bbb"
    },

    input: {
        width: "100%",
        padding: 12,
        marginBottom: 12,
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(0,0,0,0.3)",
        color: "#fff",
        outline: "none"
    },

    button: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "none",
        background: "#d6b25e",
        color: "#111",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: 10
    },

    bottomText: {
        marginTop: 15,
        fontSize: 13,
        color: "#ccc"
    },

    link: {
        color: "#d6b25e",
        textDecoration: "none"
    }
};