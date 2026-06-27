import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, fixImageUrl } from "../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="260">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="150" cy="105" r="40" fill="#d1d5db"/>
            <rect x="85" y="170" width="130" height="12" rx="6" fill="#d1d5db"/>
            <text x="50%" y="215" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="16" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function LatestProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchLatestProducts();
    }, []);

    const fetchLatestProducts = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/Products/latest`);
            const data = await res.json();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setProducts(list);
        } catch (error) {
            console.log("Latest products error:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBuyNow = (p) => {
        const id = p.id || p.Id;
        const name = p.name || p.Name || "";
        const price = p.price || p.Price || 0;
        const imageUrl = p.imageUrl || p.ImageUrl || "";

        const buyNowItem = {
            id,
            name,
            price,
            imageUrl,
            quantity: 1
        };

        localStorage.setItem("cart", JSON.stringify([buyNowItem]));
        window.dispatchEvent(new Event("cartUpdated"));

        navigate("/checkout");
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center text-gray-500 text-sm">
                    Đang tải sản phẩm mới nhất...
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center">
                    <p className="uppercase tracking-[4px] text-amber-500 text-xs font-semibold">
                        New Arrival
                    </p>

                    <h2 className="text-3xl font-bold mt-3 text-gray-950">
                        Latest product
                    </h2>

                    <p className="mt-5 text-sm text-gray-500">
                        Chưa có sản phẩm mới.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            {/* TITLE */}
            <div className="text-center mb-10">
                <p className="uppercase tracking-[4px] text-amber-500 text-xs font-semibold">
                    New Arrival
                </p>

                <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-950">
                    Latest product
                </h2>

                <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                    const id = p.id || p.Id;
                    const name = p.name || p.Name || "";
                    const price = p.price || p.Price || 0;
                    const imageUrl = p.imageUrl || p.ImageUrl || "";

                    return (
                        <div
                            key={id}
                            className="group bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition duration-300"
                        >
                            {/* IMAGE */}
                            <Link to={`/product/${id}`}>
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    <img
                                        src={fixImageUrl(imageUrl) || NO_IMAGE}
                                        alt={name}
                                        onError={(e) => {
                                            e.currentTarget.src = NO_IMAGE;
                                        }}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                    />

                                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow">
                                        NEW
                                    </span>
                                </div>
                            </Link>

                            {/* BODY */}
                            <div className="p-5 text-center">
                                <Link to={`/product/${id}`}>
                                    <h3 className="text-base font-bold text-gray-950 mb-2 line-clamp-2 min-h-[48px] hover:text-amber-600 transition">
                                        {name}
                                    </h3>
                                </Link>

                                <p className="text-xl font-bold text-amber-600 mb-5">
                                    {Number(price).toLocaleString()} đ
                                </p>

                                <div className="flex gap-3">
                                    <Link
                                        to={`/product/${id}`}
                                        className="flex-1 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:border-amber-500 hover:text-amber-600 transition"
                                    >
                                        Chi tiết
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => handleBuyNow(p)}
                                        className="flex-1 py-2.5 rounded-full bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600 transition"
                                    >
                                        Mua ngay
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}