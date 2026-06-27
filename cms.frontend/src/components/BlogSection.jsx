import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/blogService";
import { fixImageUrl } from "../config/appConfig";

export default function BlogSection() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);

            const data = await getPosts();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setPosts(list.slice(0, 3));
        } catch (error) {
            console.log("Lỗi load blog:", error);
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
            <section className="bg-white py-12 px-6 lg:px-20">
                <div className="text-center text-gray-500">
                    Loading blog...
                </div>
            </section>
        );
    }

    if (posts.length === 0) {
        return (
            <section className="bg-white py-12 px-6 lg:px-20">
                <div className="text-center">
                    <p className="uppercase tracking-[4px] text-amber-600 text-xs font-semibold">
                        Blog
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900">
                        Fashion Insights
                    </h2>

                    <p className="mt-5 text-gray-500">
                        No blog posts available.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-12 px-6 lg:px-20">
            <div className="text-center mb-10">
                <p className="uppercase tracking-[4px] text-amber-600 text-xs font-semibold">
                    Blog
                </p>

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                    Fashion Insights
                </h2>

                <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => {
                    const title = p.title || p.Title || "";
                    const content = p.content || p.Content || "";
                    const imageUrl = p.imageUrl || p.ImageUrl || "";
                    const createdDate = p.createdDate || p.CreatedDate;

                    return (
                        <div
                            key={p.id || p.Id}
                            className="group overflow-hidden rounded-2xl bg-white border border-amber-100 shadow-sm hover:shadow-xl transition duration-300"
                        >
                            <Link to={`/post/${p.id || p.Id}`}>
                                <div className="h-52 overflow-hidden bg-gray-100">
                                    <img
                                        src={fixImageUrl(imageUrl)}
                                        alt={title}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "data:image/svg+xml;charset=UTF-8," +
                                                encodeURIComponent(`
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="220">
                                                        <rect width="100%" height="100%" fill="#f3f4f6"/>
                                                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                                                            fill="#9ca3af" font-size="16" font-family="Arial">
                                                            No Image
                                                        </text>
                                                    </svg>
                                                `);
                                        }}
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </Link>

                            <div className="p-5">
                                {createdDate && (
                                    <div className="mb-2 text-xs text-gray-400">
                                        {new Date(createdDate).toLocaleDateString()}
                                    </div>
                                )}

                                <Link
                                    to={`/post/${p.id || p.Id}`}
                                    className="block text-lg font-bold text-gray-900 hover:text-amber-600 transition line-clamp-2"
                                >
                                    {title}
                                </Link>

                                <p className="mt-3 text-sm text-gray-500 leading-6 line-clamp-3">
                                    {stripHtml(content)
                                        ? stripHtml(content).slice(0, 120) + "..."
                                        : "No content available."}
                                </p>

                                <div className="mt-5">
                                    <Link
                                        to={`/post/${p.id || p.Id}`}
                                        className="inline-flex items-center rounded-full border border-amber-600 px-5 py-2 text-sm font-semibold text-amber-600 hover:bg-amber-600 hover:text-white transition"
                                    >
                                        Đọc thêm →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}