import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const BASE = "https://localhost:7194";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        passwordHash: ""
    });

    const handleChange = (e) => {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async () => {
        if (!form.username || !form.passwordHash) {
            alert("Thiếu thông tin");
            return;
        }

        const res = await fetch(`${BASE}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: form.username.trim(),
                passwordHash: form.passwordHash.trim()
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Đăng nhập thất bại");
            return;
        }

     
        localStorage.setItem("user", JSON.stringify({
            ...data.user,
            customerId: data.customerId
        }));

        navigate("/");
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>LOGIN</h2>

                <input
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    style={styles.input}
                />

                <input
                    name="passwordHash"
                    type="password"
                    placeholder="Password"
                    value={form.passwordHash}
                    onChange={handleChange}
                    style={styles.input}
                />

                <button onClick={handleLogin} style={styles.button}>
                    Đăng nhập
                </button>

                <p style={styles.text}>
                    Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
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
        background: "#111"
    },
    card: {
        width: 380,
        padding: 30,
        borderRadius: 12,
        background: "#1c1c1c",
        color: "#fff",
        textAlign: "center"
    },
    title: {
        marginBottom: 20,
        color: "#d6b25e"
    },
    input: {
        width: "100%",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #333",
        background: "#000",
        color: "#fff"
    },
    button: {
        width: "100%",
        padding: 12,
        background: "#d6b25e",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: "bold"
    },
    text: {
        marginTop: 10,
        fontSize: 13,
        color: "#aaa"
    }
};