import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ShopSidebar from "../../components/ShopSidebar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_BASE_URL, fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="150" cy="120" r="45" fill="#d1d5db"/>
            <rect x="82" y="185" width="136" height="14" rx="7" fill="#d1d5db"/>
            <text x="50%" y="235" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="16" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

const EMPTY_RESULT_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="360" height="260" viewBox="0 0 360 260">
            <rect width="360" height="260" rx="28" fill="#fffaf1"/>
            <circle cx="160" cy="105" r="55" fill="#f3e7cf"/>
            <circle cx="160" cy="105" r="34" fill="#ffffff" stroke="#d6a84f" stroke-width="8"/>
            <line x1="190" y1="135" x2="235" y2="180" stroke="#d6a84f" stroke-width="12" stroke-linecap="round"/>
            <rect x="80" y="205" width="200" height="12" rx="6" fill="#ead7b3"/>
            <rect x="110" y="225" width="140" height="10" rx="5" fill="#f1e3c9"/>
        </svg>
    `);

export default function Shop() {
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);

    const page = parseInt(query.get("page")) || 1;
    const categoryId = query.get("categoryId");
    const sort = query.get("sort");
    const minPrice = query.get("minPrice");
    const maxPrice = query.get("maxPrice");
    const keyword = query.get("keyword");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        fetchProducts();
    }, [page, categoryId, sort, minPrice, maxPrice, keyword]);

    const getImage = (url) => {
        if (!url) return NO_IMAGE;

        const image = fixImageUrl(url);
        return image || NO_IMAGE;
    };

    const fetchProducts = async () => {
        let url = `${API_BASE_URL}/api/products/shop?page=${page}&pageSize=4`;

        if (categoryId) url += `&categoryId=${categoryId}`;
        if (sort) url += `&sort=${sort}`;
        if (minPrice) url += `&minPrice=${minPrice}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

        try {
            setLoading(true);

            const res = await fetch(url);

            if (!res.ok) {
                console.log(await res.text());
                setProducts([]);
                return;
            }

            const data = await res.json();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setProducts(list);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.log("Product error:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const changePage = (newPage) => {
        const params = new URLSearchParams(location.search);
        params.set("page", newPage);
        navigate(`/shop?${params.toString()}`);
    };

    const clearAllFilters = () => {
        navigate("/shop?page=1");
    };

    return (
        <>
            <Header />

            <main className="bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-7 text-center">
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
                            Shop Collection
                        </h1>

                        {keyword && (
                            <p className="mt-2 text-sm text-gray-500">
                                Search results for{" "}
                                <span className="font-bold text-amber-700">
                                    "{keyword}"
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="mb-5">
                        <Link
                            to="/"
                            className="inline-flex items-center px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-900 text-sm font-medium hover:bg-gray-950 hover:text-white transition"
                        >
                            Back Home
                        </Link>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5">
                        <ShopSidebar />

                        <section className="flex-1">
                            {loading ? (
                                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-10 text-center text-gray-500 text-sm">
                                    Loading products...
                                </div>
                            ) : products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                                        {products.map((p) => {
                                            const id = p.id || p.Id;
                                            const name = p.name || p.Name || "";
                                            const price = p.price || p.Price || 0;
                                            const imageUrl = p.imageUrl || p.ImageUrl || "";
                                            const soldQuantity =
                                                p.soldQuantity || p.SoldQuantity || 0;

                                            return (
                                                <Link
                                                    key={id}
                                                    to={`/product/${id}`}
                                                    className="relative bg-white rounded-2xl overflow-hidden text-gray-900 shadow-sm border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group"
                                                >
                                                    <div className="w-full h-[220px] overflow-hidden bg-gray-100">
                                                        <img
                                                            src={getImage(imageUrl)}
                                                            alt={name || "product"}
                                                            onError={(e) => {
                                                                e.currentTarget.src = NO_IMAGE;
                                                            }}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                                        />
                                                    </div>

                                                    <div className="p-4">
                                                        <h3 className="text-sm font-bold text-gray-950 min-h-10 line-clamp-2 group-hover:text-amber-600 transition">
                                                            {name}
                                                        </h3>

                                                        <p className="mt-2 text-amber-700 font-bold text-base">
                                                            {Number(price).toLocaleString()} đ
                                                        </p>

                                                        <p className="mt-1 text-xs text-gray-500">
                                                            Sold {soldQuantity}
                                                        </p>
                                                    </div>

                                                    {soldQuantity > 5 && (
                                                        <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                                                            HOT
                                                        </span>
                                                    )}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => changePage(page - 1)}
                                            className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-amber-500 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            ←
                                        </button>

                                        <div className="px-5 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium">
                                                Page {page} / {totalPages}
                                        </div>

                                            <button
                                                type="button"
                                                disabled={page >= totalPages}
                                                onClick={() => changePage(page + 1)}
                                                className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-amber-500 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                →
                                            </button>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 px-6 py-12 text-center">
                                    <img
                                        src={EMPTY_RESULT_IMAGE}
                                        alt="No result"
                                        className="mx-auto w-56 md:w-64 mb-6"
                                    />

                                    <h2 className="text-xl md:text-2xl font-bold text-gray-950 mb-3">
                                        Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn
                                    </h2>

                                    <p className="text-sm text-gray-500 mb-7">
                                        Vui lòng thử lại với từ khóa khác hoặc thay đổi khoảng giá.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={clearAllFilters}
                                        className="px-7 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                                    >
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}