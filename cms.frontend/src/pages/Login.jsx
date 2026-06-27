import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/appConfig";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        passwordHash: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleLogin = async () => {
        setError("");

        if (!form.username.trim() || !form.passwordHash.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: form.username.trim(),
                    passwordHash: form.passwordHash.trim()
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đăng nhập thất bại.");
                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...data.user,
                    customerId: data.customerId
                })
            );

            navigate("/");
        } catch (err) {
            console.log("Login error:", err);
            setError("Lỗi kết nối máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-950 to-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link
                        to="/"
                        className="text-3xl font-bold text-amber-500"
                    >
                        Luxury Jewelry
                    </Link>

                    <p className="mt-3 text-sm text-gray-400">
                        Welcome back. Login to continue shopping.
                    </p>
                </div>

                <section className="rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="px-7 py-8">
                        <div className="mb-7 text-center">
                            <p className="text-xs uppercase tracking-[4px] text-amber-400 mb-2">
                                Member Access
                            </p>

                            <h1 className="text-3xl font-bold text-white">
                                Đăng nhập
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Username
                                </label>

                                <input
                                    name="username"
                                    placeholder="Nhập username..."
                                    value={form.username}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleLogin();
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Password
                                </label>

                                <input
                                    name="passwordHash"
                                    type="password"
                                    placeholder="Nhập mật khẩu..."
                                    value={form.passwordHash}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleLogin();
                                    }}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleLogin}
                            disabled={loading}
                            className="mt-6 w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </button>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Chưa có tài khoản?{" "}
                            <Link
                                to="/register"
                                className="font-semibold text-amber-400 hover:text-amber-300 transition"
                            >
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>

                    <div className="border-t border-white/10 bg-black/30 px-7 py-4 text-center">
                        <Link
                            to="/"
                            className="text-xs text-gray-500 hover:text-amber-400 transition"
                        >
                            ← Quay lại trang chủ
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}