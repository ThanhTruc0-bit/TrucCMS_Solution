/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
import { useState } from "react";
import { login } from "../services/ApiService";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await login({
            email,
            password,
        });

        console.log(res);

        if (res.customerId) {
            localStorage.setItem("customerId", res.customerId);
            alert("Đăng nhập thành công");
        } else {
            alert("Sai tài khoản");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}