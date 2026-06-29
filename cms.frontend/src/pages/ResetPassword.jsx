import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../config/appConfig";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        setError("");

        if (!email || !token) {
            setError("Link đặt lại mật khẩu không hợp lệ.");
            return;
        }

        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError("Vui lòng nhập đầy đủ mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Đặt lại mật khẩu thất bại.");
                return;
            }

            alert("Đặt lại mật khẩu thành công ✨");
            navigate("/login");
        } catch (err) {
            console.log("Reset password error:", err);
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
                        Create a new password for your account.
                    </p>
                </div>

                <section className="rounded-3xl border border-amber-500/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="px-7 py-8">
                        <div className="mb-7 text-center">
                            <p className="text-xs uppercase tracking-[4px] text-amber-400 mb-2">
                                Reset Password
                            </p>

                            <h1 className="text-3xl font-bold text-white">
                                Đặt lại mật khẩu
                            </h1>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Mật khẩu mới
                                </label>

                                <input
                                    type="password"
                                    placeholder="Nhập mật khẩu mới..."
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                    Xác nhận mật khẩu
                                </label>

                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu..."
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleReset();
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
                            onClick={handleReset}
                            disabled={loading}
                            className="mt-6 w-full rounded-full bg-amber-500 py-3 text-sm font-bold text-black hover:bg-amber-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                        </button>

                        <div className="mt-6 text-center text-sm text-gray-400">
                            Quay lại{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-amber-400 hover:text-amber-300 transition"
                            >
                                Đăng nhập
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}