import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="220">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="150" cy="85" r="35" fill="#d1d5db"/>
            <rect x="85" y="140" width="130" height="12" rx="6" fill="#d1d5db"/>
            <text x="50%" y="180" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="16" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE_URL}/api/Posts/paging?page=${page}&pageSize=6`
            );

            const data = await res.json();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setPosts(list);
        } catch (err) {
            console.log("Load blog error:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]+>/g, "").trim();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f4ed] flex items-center justify-center text-sm text-gray-500">
                Đang tải tin tức...
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
                            News & Trends
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Discover the latest jewelry news, trends and fashion inspiration.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-fit px-5 py-2.5 rounded-full bg-white border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-950 hover:text-white transition"
                    >
                        ← Home
                    </button>
                </div>

                {/* GRID */}
                {posts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-8 text-center">
                        <p className="text-sm text-gray-500">
                            No articles available.
                        </p>
                    </div>
                ) : (
                        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 items-stretch">
                        {posts.map((post) => {
                            const id = post.id || post.Id;
                            const title = post.title || post.Title || "";
                            const content = post.content || post.Content || "";
                            const imageUrl = post.imageUrl || post.ImageUrl || "";
                            const createdDate =
                                post.createdDate ||
                                post.CreatedDate ||
                                post.createdAt ||
                                post.CreatedAt;

                            const shortContent = stripHtml(content);

                            return (
                                <article
                                    key={id}
                                    className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition duration-300"
                                >
                                    <Link to={`/post/${id}`}>
                                        <div className="relative h-60 overflow-hidden bg-gray-100">
                                            <img
                                                src={fixImageUrl(imageUrl) || NO_IMAGE}
                                                alt={title}
                                                onError={(e) => {
                                                    e.currentTarget.src = NO_IMAGE;
                                                }}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                            />
                                        </div>
                                    </Link>

                                    <div className="p-6 flex flex-col flex-1">
                                        {createdDate && (
                                            <div className="text-xs text-gray-400 mb-2">
                                                🗓 {new Date(createdDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        <Link to={`/post/${id}`}>
                                            <h3 className="text-xl font-bold text-gray-950 hover:text-amber-600 transition mb-3 line-clamp-2 min-h-[60px]">
                                                {title}
                                            </h3>
                                        </Link>

                                        <p className="text-gray-500 text-sm leading-7 line-clamp-3 flex-1">
                                            {shortContent
                                                ? shortContent.slice(0, 120) + "..."
                                                : "Không có nội dung"}
                                        </p>

                                        <div className="mt-6">
                                            <Link
                                                to={`/post/${id}`}
                                                className="flex items-center justify-center w-full py-3 rounded-full border border-amber-500 text-amber-600 text-sm font-semibold hover:bg-amber-500 hover:text-white transition"
                                            >
                                                Read More →
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* PAGINATION */}
                {posts.length > 0 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            type="button"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition ${page === 1
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-white text-gray-800 hover:bg-amber-500 hover:text-white hover:border-amber-500"
                                }`}
                        >
                            ← Previous
                        </button>

                        <span className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-700">
                            Page {page}
                        </span>

                        <button
                            type="button"
                            onClick={() => setPage(page + 1)}
                            className="px-5 py-2.5 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}