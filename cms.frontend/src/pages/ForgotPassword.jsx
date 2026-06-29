import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config/appConfig";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setMessage("");
        setError("");

        if (!email.trim()) {
            setError("Vui lòng nhập email.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim()
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Không thể gửi yêu cầu.");
                return;
            }

            setMessage(data.message || "Vui lòng kiểm tra email.");
        } catch (err) {
            console.log("Forgot password error:", err);
            setError("Lỗi kết nối máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-950 via-zinc-950 to-black flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-3xl font-bold text-amber-500">
                        Luxury Jewelry
                    </Link>

                    <p className="mt-3 text-sm text-gray-400">
                        Enter your email to reset your password.
                    </p>
                </div>

                <section className="rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="px-7 py-8">
                        <div className="mb-7 text-center">
                            <p className="text-xs uppercase tracking-[4px] text-amber-400 mb-2">
                                Account Recovery
                            </p>

                            <h1 className="text-3xl font-bold text-white">
                                Quên mật khẩu
                            </h1>
                        </div>

                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Nhập email đăng ký..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSubmit();
                            }}
                            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                        />

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300">
                                {message}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="mt-6 w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
                        </button>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Nhớ mật khẩu?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-amber-400 hover:text-amber-300 transition"
                            >
                                Đăng nhập
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