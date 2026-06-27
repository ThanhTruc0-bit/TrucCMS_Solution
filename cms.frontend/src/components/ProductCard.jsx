import { Link, useNavigate } from "react-router-dom";
import { fixImageUrl } from "../config/appConfig";

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

export default function ProductCard({ id, name, price, imageUrl }) {
    const navigate = useNavigate();

    const handleBuyNow = () => {
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

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition duration-300">
            {/* IMAGE */}
            <Link to={`/product/${id}`}>
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                        src={fixImageUrl(imageUrl) || NO_IMAGE}
                        alt={name || "product"}
                        onError={(e) => {
                            e.currentTarget.src = NO_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />

                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full shadow">
                        Jewelry
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
                    {Number(price || 0).toLocaleString()} đ
                </p>

                <div className="flex gap-3">
                    <Link
                        to={`/product/${id}`}
                        className="flex-1 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:border-amber-500 hover:text-amber-600 transition"
                    >
                        Details
                    </Link>

                    <button
                        type="button"
                        onClick={handleBuyNow}
                        className="flex-1 py-2.5 rounded-full bg-amber-500 text-sm font-semibold text-white hover:bg-amber-600 transition"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}