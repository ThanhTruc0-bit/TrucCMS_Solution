import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [openUser, setOpenUser] = useState(false);
    const [user, setUser] = useState(null);

    const userRef = useRef(null);
    const searchFirstLoad = useRef(true);

    useEffect(() => {
        const loadUser = () => {
            try {
                const data = JSON.parse(localStorage.getItem("user"));
                setUser(data);
            } catch {
                setUser(null);
            }
        };

        const updateCart = () => {
            const cart = JSON.parse(localStorage.getItem("cart")) || [];
            const totalQty = cart.reduce(
                (sum, item) => sum + Number(item.quantity || 0),
                0
            );

            setCartCount(totalQty);
        };

        loadUser();
        updateCart();

        window.addEventListener("storage", updateCart);
        window.addEventListener("cartUpdated", updateCart);

        return () => {
            window.removeEventListener("storage", updateCart);
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, []);

    useEffect(() => {
        if (searchFirstLoad.current) {
            searchFirstLoad.current = false;
            return;
        }

        const text = keyword.trim();

        const timer = setTimeout(() => {
            if (!text) return;
            navigate(`/shop?keyword=${encodeURIComponent(text)}&page=1`);
        }, 500);

        return () => clearTimeout(timer);
    }, [keyword, navigate]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userRef.current && !userRef.current.contains(e.target)) {
                setOpenUser(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = () => {
        const text = keyword.trim();

        if (!text) return;

        navigate(`/shop?keyword=${encodeURIComponent(text)}&page=1`);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        document.cookie =
            "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        setUser(null);
        setOpenUser(false);
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm font-sans text-gray-800">
            {/* TOP HEADER */}
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                {/* LOGO */}
                <Link
                    to="/"
                    className="text-2xl md:text-3xl font-bold text-amber-500 whitespace-nowrap"
                >
                    Luxury Jewelry
                </Link>

                {/* SEARCH */}
                <div className="hidden md:flex flex-1 mx-10">
                    <div className="flex w-full rounded-full border border-gray-200 overflow-hidden bg-gray-50">
                        <input
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                            placeholder="Search jewelry..."
                            className="flex-1 px-5 py-2.5 bg-transparent outline-none text-sm"
                        />

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="px-6 bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">
                    {/* USER */}
                    <div ref={userRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setOpenUser(!openUser)}
                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-amber-500 hover:text-white transition flex items-center justify-center text-lg"
                        >
                            👤
                        </button>

                        {openUser && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
                                {!user ? (
                                    <>
                                        <div className="px-5 py-4 bg-[#faf7f1] border-b border-amber-100">
                                            <p className="text-sm font-bold text-gray-950">
                                                Welcome Guest
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                Login to manage your orders.
                                            </p>
                                        </div>

                                        <Link
                                            to="/login"
                                            onClick={() => setOpenUser(false)}
                                            className="block px-5 py-3 text-sm font-medium hover:bg-amber-50 transition"
                                        >
                                            Login
                                        </Link>

                                        <Link
                                            to="/register"
                                            onClick={() => setOpenUser(false)}
                                            className="block px-5 py-3 text-sm font-medium hover:bg-amber-50 transition"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div className="px-5 py-4 bg-[#faf7f1] border-b border-amber-100">
                                            <p className="font-bold text-gray-950 text-sm">
                                                👤 {user.fullName || user.name || user.username}
                                            </p>

                                            {user.email && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {user.email}
                                                </p>
                                            )}

                                            {user.phone && (
                                                <p className="text-xs text-gray-500">
                                                    {user.phone}
                                                </p>
                                            )}
                                        </div>

                                        <Link
                                            to="/my-orders"
                                            onClick={() => setOpenUser(false)}
                                            className="block px-5 py-3 text-sm font-medium hover:bg-amber-50 transition"
                                        >
                                            📦 My Orders
                                        </Link>

                                        <Link
                                            to="/cart"
                                            onClick={() => setOpenUser(false)}
                                            className="block px-5 py-3 text-sm font-medium hover:bg-amber-50 transition"
                                        >
                                            🛍️ My Cart
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full text-left px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition border-t border-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CART */}
                    <Link
                        to="/cart"
                        className="relative text-3xl hover:text-amber-500 transition"
                    >
                        🛍️

                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* MENU */}
            <nav className="border-t border-gray-100 border-b bg-white">
                <div className="max-w-7xl mx-auto flex justify-center gap-8 py-3 text-sm font-medium">
                    <Link to="/" className="hover:text-amber-500 transition">
                        Home
                    </Link>

                    <Link to="/shop" className="hover:text-amber-500 transition">
                        Shop
                    </Link>

                    <Link to="/blog" className="hover:text-amber-500 transition">
                        Blog
                    </Link>

                    <Link to="/about" className="hover:text-amber-500 transition">
                        About Us
                    </Link>
                </div>
            </nav>
        </header>
    );
}