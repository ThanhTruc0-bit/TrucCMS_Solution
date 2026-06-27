import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE_URL, fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400">
            <rect width="100%" height="100%" fill="#111827"/>
            <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="34" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function PostDetail() {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_BASE_URL}/api/Posts/${id}`);

            if (!res.ok) {
                setError("Không tìm thấy bài viết");
                setPost(null);
                return;
            }

            const data = await res.json();
            setPost(data);
        } catch (err) {
            console.log("Post detail error:", err);
            setError("Lỗi tải bài viết");
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    const getContent = () => {
        return post?.content || post?.Content || "";
    };

    const title = post?.title || post?.Title || "";
    const imageUrl = post?.imageUrl || post?.ImageUrl || "";
    const createdDate =
        post?.createdDate ||
        post?.CreatedDate ||
        post?.createdAt ||
        post?.CreatedAt;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f4ed] flex justify-center items-center text-sm text-gray-500">
                Đang tải bài viết...
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-[#f8f4ed] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-950 mb-3">
                        {error || "Không tìm thấy bài viết"}
                    </h2>

                    <p className="text-sm text-gray-500 mb-5">
                        Vui lòng quay lại danh sách bài viết.
                    </p>

                    <Link
                        to="/blog"
                        className="inline-flex px-6 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                    >
                        ← Quay lại Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="bg-[#f8f4ed] min-h-screen">
            {/* HERO */}
            <section className="relative h-[320px] md:h-[360px] overflow-hidden">
                <img
                    src={fixImageUrl(imageUrl) || NO_IMAGE}
                    alt={title}
                    onError={(e) => {
                        e.currentTarget.src = NO_IMAGE;
                    }}
                    className="w-full h-full object-cover brightness-50"
                />

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-5">
                    <p className="text-xs uppercase tracking-[4px] text-amber-300 mb-3">
                        Luxury Jewelry
                    </p>

                    <h1 className="text-white text-3xl md:text-4xl font-bold max-w-4xl leading-tight">
                        {title}
                    </h1>

                    {createdDate && (
                        <p className="text-gray-200 mt-4 text-sm">
                            {new Date(createdDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </section>

            {/* CONTENT */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 py-8">
                <div className="mb-5">
                    <Link
                        to="/blog"
                        className="inline-flex px-5 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-gray-800 hover:bg-gray-950 hover:text-white transition"
                    >
                        ← Back To Blog
                    </Link>
                </div>

                <article className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 md:p-8">
                    <div
                        className="ckeditor-content"
                        dangerouslySetInnerHTML={{
                            __html: getContent(),
                        }}
                    />
                </article>
            </section>

            <style>
                {`
                    .ckeditor-content {
                        color: #374151;
                        font-size: 16px;
                        line-height: 1.85;
                    }

                    .ckeditor-content p {
                        margin-bottom: 16px;
                    }

                    .ckeditor-content strong,
                    .ckeditor-content b {
                        font-weight: 700;
                        color: #111827;
                    }

                    .ckeditor-content em,
                    .ckeditor-content i {
                        font-style: italic;
                    }

                    .ckeditor-content h1,
                    .ckeditor-content h2,
                    .ckeditor-content h3 {
                        color: #111827;
                        font-weight: 700;
                        margin: 24px 0 14px;
                        line-height: 1.35;
                    }

                    .ckeditor-content h1 {
                        font-size: 30px;
                    }

                    .ckeditor-content h2 {
                        font-size: 24px;
                    }

                    .ckeditor-content h3 {
                        font-size: 20px;
                    }

                    .ckeditor-content ul,
                    .ckeditor-content ol {
                        padding-left: 28px;
                        margin: 14px 0;
                    }

                    .ckeditor-content ul {
                        list-style: disc;
                    }

                    .ckeditor-content ol {
                        list-style: decimal;
                    }

                    .ckeditor-content blockquote {
                        border-left: 4px solid #d97706;
                        padding-left: 16px;
                        color: #6b7280;
                        font-style: italic;
                        margin: 20px 0;
                    }

                    .ckeditor-content a {
                        color: #d97706;
                        font-weight: 600;
                        text-decoration: underline;
                    }

                    .ckeditor-content img {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 24px auto;
                        border-radius: 16px;
                        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
                    }

                    .ckeditor-content figure {
                        margin: 24px auto;
                        text-align: center;
                    }

                    .ckeditor-content figure img {
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .ckeditor-content .image,
                    .ckeditor-content .image-style-align-center {
                        text-align: center;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .ckeditor-content .image-style-align-left {
                        float: left;
                        margin-right: 20px;
                    }

                    .ckeditor-content .image-style-align-right {
                        float: right;
                        margin-left: 20px;
                    }

                    .ckeditor-content table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }

                    .ckeditor-content table td,
                    .ckeditor-content table th {
                        border: 1px solid #e5e7eb;
                        padding: 10px;
                    }
                `}
            </style>
        </main>
    );
}