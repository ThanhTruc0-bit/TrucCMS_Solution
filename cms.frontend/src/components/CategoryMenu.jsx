import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";
import { fixImageUrl } from "../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="75" cy="60" r="22" fill="#d1d5db"/>
            <rect x="35" y="95" width="80" height="10" rx="5" fill="#d1d5db"/>
            <text x="50%" y="130" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="13" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function CategoryMenu() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Category error:", err);
        }
    };

    const getImage = (url) => {
        if (!url) return NO_IMAGE;

        const image = fixImageUrl(url);
        return image || NO_IMAGE;
    };

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(90px,1fr))] gap-5 justify-items-center mt-10 px-6 md:px-20">
            {/* ALL */}
            <Link
                to="/shop"
                className="text-center no-underline text-gray-900 group"
            >
                <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center transition duration-300 group-hover:border-amber-500 group-hover:shadow-md bg-gray-100">
                    <img
                        src={NO_IMAGE}
                        alt="all"
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                    />
                </div>

                <div className="mt-2 text-[13px] font-medium group-hover:text-amber-500 transition">
                    ALL
                </div>
            </Link>

            {categories.map((c) => (
                <Link
                    key={c.id}
                    to={`/shop?categoryId=${c.id}&page=1`}
                    className="text-center no-underline text-gray-900 group"
                >
                    <div className="w-[85px] h-[85px] rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center transition duration-300 group-hover:border-amber-500 group-hover:shadow-md bg-gray-100">
                        <img
                            src={getImage(c.imageUrl || c.ImageUrl)}
                            alt={c.name || c.Name || "category"}
                            onError={(e) => {
                                e.currentTarget.src = NO_IMAGE;
                            }}
                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                        />
                    </div>

                    <div className="mt-2 text-[13px] font-medium group-hover:text-amber-500 transition">
                        {c.name || c.Name}
                    </div>
                </Link>
            ))}
        </div>
    );
}