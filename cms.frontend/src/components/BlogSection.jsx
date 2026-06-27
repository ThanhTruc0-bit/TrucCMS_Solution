import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/blogService";
import { fixImageUrl } from "../config/appConfig";

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
            console.log("Load blog error:", error);
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
            <section className="bg-white py-14 px-6 lg:px-10">
                <div className="text-center text-gray-500">
                    Loading articles...
                </div>
            </section>
        );
    }

    if (posts.length === 0) {
        return (
            <section className="bg-white py-14 px-6 lg:px-10">
                <div className="text-center">
                    <p className="uppercase tracking-[4px] text-amber-500 text-xs font-semibold">
                        Blog
                    </p>

                    <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                        Latest Articles
                    </h2>

                    <p className="mt-5 text-gray-500">
                        No blog posts available.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-white py-14 px-6 lg:px-10">
            {/* HEADER */}
            <div className="text-center mb-10">
                <p className="uppercase tracking-[4px] text-amber-500 text-xs font-semibold">
                    Blog
                </p>

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
                    Latest Articles
                </h2>

                <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
            </div>

            {/* GRID */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p) => {
                    const id = p.id || p.Id;
                    const title = p.title || p.Title || "";
                    const content = p.content || p.Content || "";
                    const imageUrl = p.imageUrl || p.ImageUrl || "";
                    const createdDate = p.createdDate || p.CreatedDate;

                    return (
                        <div
                            key={id}
                            className="group bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-xl transition duration-300"
                        >
                            <Link to={`/post/${id}`}>
                                <div className="h-56 overflow-hidden bg-gray-100">
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

                            <div className="p-5 text-center">
                                <p className="text-xs uppercase tracking-[4px] text-amber-500 font-semibold mb-2">
                                    Fashion Blog
                                </p>

                                {createdDate && (
                                    <p className="text-xs text-gray-400 mb-3">
                                        {new Date(createdDate).toLocaleDateString()}
                                    </p>
                                )}

                                <Link to={`/post/${id}`}>
                                    <h3 className="text-lg font-bold text-gray-900 hover:text-amber-600 transition line-clamp-2 min-h-[56px]">
                                        {title}
                                    </h3>
                                </Link>

                                <p className="mt-3 text-sm text-gray-500 leading-6 line-clamp-3 min-h-[72px]">
                                    {stripHtml(content)
                                        ? stripHtml(content).slice(0, 120) + "..."
                                        : "No content available."}
                                </p>

                                <div className="mt-6">
                                    <Link
                                        to={`/post/${id}`}
                                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition"
                                    >
                                        Read More
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