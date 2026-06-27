import { Link } from "react-router-dom";
import { fixImageUrl } from "../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="240">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="150" cy="95" r="38" fill="#d1d5db"/>
            <rect x="85" y="155" width="130" height="12" rx="6" fill="#d1d5db"/>
            <text x="50%" y="200" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="16" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function PostCard({ id, title, imageUrl }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition duration-300">
            {/* IMAGE */}
            <Link to={`/post/${id}`}>
                <div className="overflow-hidden h-52 bg-gray-100">
                    <img
                        src={fixImageUrl(imageUrl) || NO_IMAGE}
                        alt={title || "post"}
                        onError={(e) => {
                            e.currentTarget.src = NO_IMAGE;
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                </div>
            </Link>

            {/* CONTENT */}
            <div className="p-5 text-center">
                <p className="text-xs uppercase tracking-[4px] text-amber-500 font-semibold mb-2">
                    Fashion Blog
                </p>

                <Link to={`/post/${id}`}>
                    <h3 className="text-base font-bold text-gray-950 leading-6 mb-5 min-h-[48px] line-clamp-2 hover:text-amber-600 transition">
                        {title}
                    </h3>
                </Link>

                <Link
                    to={`/post/${id}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition"
                >
                    Đọc bài viết
                </Link>
            </div>
        </div>
    );
}