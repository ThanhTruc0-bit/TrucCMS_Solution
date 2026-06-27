import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { API_BASE_URL } from "../config/appConfig";

export default function ProductGrid() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();

    const page = parseInt(searchParams.get("page")) || 1;
    const categoryId = searchParams.get("categoryId");

    useEffect(() => {
        fetchProducts();
    }, [page, categoryId]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            let url = `${API_BASE_URL}/api/Products/paging?page=${page}&pageSize=8`;

            if (categoryId) {
                url = `${API_BASE_URL}/api/Products/category/${categoryId}`;
            }

            const res = await fetch(url);
            const result = await res.json();

            const list = Array.isArray(result)
                ? result
                : Array.isArray(result?.data)
                    ? result.data
                    : [];

            setProducts(list);
        } catch (error) {
            console.log("Lỗi load sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center text-gray-500 text-sm">
                    Đang tải sản phẩm...
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
            <div className="text-center mb-10">
                <p className="uppercase tracking-[4px] text-amber-500 text-xs font-semibold">
                    Luxury Collection
                </p>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mt-3">
                    All products
                </h2>

                <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {products.length === 0 ? (
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Chưa có sản phẩm nào.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((p) => (
                        <ProductCard
                            key={p.id || p.Id}
                            id={p.id || p.Id}
                            name={p.name || p.Name}
                            price={p.price || p.Price}
                            imageUrl={p.imageUrl || p.ImageUrl}
                        />
                    ))}
                </div>
            )}

            {!categoryId && products.length > 0 && (
                <div className="flex justify-center items-center gap-4 mt-10">
                    {page > 1 && (
                        <Link
                            to={`?page=${page - 1}`}
                            className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition"
                        >
                            ← Prev
                        </Link>
                    )}

                    <span className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700">
                        Trang {page}
                    </span>

                    <Link
                        to={`?page=${page + 1}`}
                        className="px-5 py-2.5 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
                    >
                        Next →
                    </Link>
                </div>
            )}
        </section>
    );
}