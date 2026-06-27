import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCategories } from "../services/categoryApi";

export default function ShopSidebar() {
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const query = new URLSearchParams(location.search);

    const currentCategory = query.get("categoryId") || "";
    const currentSort = query.get("sort") || "";

    const [minPrice, setMinPrice] = useState(query.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(query.get("maxPrice") || "");

    const firstLoad = useRef(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        setMinPrice(params.get("minPrice") || "");
        setMaxPrice(params.get("maxPrice") || "");
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setCategories(list);
        } catch (err) {
            console.log("Category sidebar error:", err);
            setCategories([]);
        }
    };

    const updateQuery = (key, value) => {
        const params = new URLSearchParams(location.search);

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.set("page", 1);

        navigate(`/shop?${params.toString()}`);
    };

    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const params = new URLSearchParams(location.search);

            const currentMin = params.get("minPrice") || "";
            const currentMax = params.get("maxPrice") || "";

            if (currentMin === minPrice && currentMax === maxPrice) {
                return;
            }

            if (minPrice)
                params.set("minPrice", minPrice);
            else
                params.delete("minPrice");

            if (maxPrice)
                params.set("maxPrice", maxPrice);
            else
                params.delete("maxPrice");

            params.set("page", "1");

            navigate(`/shop?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [minPrice, maxPrice]);

    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        navigate("/shop?page=1");
    };

    return (
        <aside className="w-full lg:w-72 bg-white rounded-2xl border border-amber-100 shadow-sm p-5 sticky top-24 h-fit">
            <div className="mb-5">
                <p className="text-xs uppercase tracking-[3px] text-amber-600 font-semibold mb-1">
                    Product Filter
                </p>

                <h2 className="text-xl font-bold text-gray-950">
                    Filters
                </h2>
            </div>

            {/* CATEGORY */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                </label>

                <select
                    value={currentCategory}
                    onChange={(e) => updateQuery("categoryId", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 bg-white text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                >
                    <option value="">All categories</option>

                    {categories.map((c) => {
                        const id = c.id || c.Id;
                        const name = c.name || c.Name;

                        return (
                            <option key={id} value={id}>
                                {name}
                            </option>
                        );
                    })}
                </select>
            </div>

            {/* SORT */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Sort by
                </label>

                <select
                    value={currentSort}
                    onChange={(e) => updateQuery("sort", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 bg-white text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                >
                    <option value="">Default</option>
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="best">Best Selling</option>
                </select>
            </div>

            {/* PRICE */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price Range
                </label>

                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />

                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                </div>

                <p className="mt-2 text-xs text-gray-500 leading-5">
                    Products update automatically after entering price.
                </p>
            </div>

            {/* CLEAR */}
            <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-full bg-gray-950 text-white py-2.5 text-sm font-semibold hover:bg-amber-600 transition"
            >
                Clear Filters
            </button>
        </aside>
    );
}