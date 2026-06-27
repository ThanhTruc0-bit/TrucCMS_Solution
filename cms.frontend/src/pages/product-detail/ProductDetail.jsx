import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_BASE_URL, fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="500">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="300" cy="200" r="70" fill="#d1d5db"/>
            <rect x="190" y="310" width="220" height="18" rx="9" fill="#d1d5db"/>
            <text x="50%" y="390" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="24" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/Products/${id}`);
            const data = await res.json();

            setProduct(data);
        } catch (error) {
            console.log("Product detail error:", error);
            setProduct(null);
        } finally {
            setLoading(false);
        }
    };

    const getProductId = () => {
        return product?.id || product?.Id;
    };

    const getProductName = () => {
        return product?.name || product?.Name || "";
    };

    const getProductPrice = () => {
        return Number(product?.price || product?.Price || 0);
    };

    const getProductImage = () => {
        return product?.imageUrl || product?.ImageUrl || "";
    };

    const getProductDescription = () => {
        return product?.description || product?.Description || "";
    };

    const getStockQuantity = () => {
        return Number(product?.stockQuantity ?? product?.StockQuantity ?? 0);
    };

    const increase = () => {
        const stockQuantity = getStockQuantity();

        if (qty >= stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return;
        }

        setQty(qty + 1);
    };

    const decrease = () => {
        if (qty > 1) {
            setQty(qty - 1);
        }
    };

    const addToCart = () => {
        if (!product) return false;

        const productId = getProductId();
        const name = getProductName();
        const price = getProductPrice();
        const imageUrl = getProductImage();
        const stockQuantity = getStockQuantity();

        if (stockQuantity <= 0) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return false;
        }

        if (qty > stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return false;
        }

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exist = cart.find((x) => Number(x.id) === Number(productId));
        const currentQtyInCart = exist ? Number(exist.quantity || 0) : 0;
        const totalQtyAfterAdd = currentQtyInCart + Number(qty);

        if (totalQtyAfterAdd > stockQuantity) {
            alert("Số lượng sản phẩm trong kho không đủ!");
            return false;
        }

        if (exist) {
            exist.quantity = totalQtyAfterAdd;
        } else {
            cart.push({
                id: productId,
                name,
                price,
                imageUrl,
                quantity: Number(qty),
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));

        alert("🛒 Đã thêm vào giỏ hàng");
        return true;
    };

    const buyNow = () => {
        const success = addToCart();

        if (success) {
            navigate("/checkout");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f4ed] flex justify-center items-center text-sm text-gray-500">
                Đang tải sản phẩm...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#f8f4ed] flex justify-center items-center px-4">
                <div className="bg-white rounded-2xl border border-amber-100 shadow-lg p-8 text-center max-w-md">
                    <h2 className="text-2xl font-bold text-gray-950 mb-3">
                        Không tìm thấy sản phẩm
                    </h2>

                    <Link
                        to="/shop"
                        className="inline-flex mt-4 px-6 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                    >
                        ← Quay lại cửa hàng
                    </Link>
                </div>
            </div>
        );
    }

    const productName = getProductName();
    const productPrice = getProductPrice();
    const productImage = getProductImage();
    const productDescription = getProductDescription();
    const stockQuantity = getStockQuantity();

    return (
        <main className="min-h-screen bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8">
            <div className="max-w-6xl mx-auto">
                {/* TOP */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-fit rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-950 hover:text-white transition"
                    >
                        ← Quay lại
                    </button>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                        <Link className="hover:text-amber-600" to="/">
                            Trang chủ
                        </Link>

                        <span>/</span>

                        <Link className="hover:text-amber-600" to="/shop">
                            Sản phẩm
                        </Link>

                        <span>/</span>

                        <span className="font-semibold text-gray-950">
                            {productName}
                        </span>
                    </div>
                </div>

                {/* MAIN */}
                <section className="grid gap-8 rounded-2xl bg-white p-5 md:p-7 shadow-lg border border-amber-100 lg:grid-cols-2">
                    {/* IMAGE */}
                    <div className="rounded-2xl bg-gray-100 overflow-hidden">
                        <img
                            src={fixImageUrl(productImage) || NO_IMAGE}
                            alt={productName}
                            onError={(e) => {
                                e.currentTarget.src = NO_IMAGE;
                            }}
                            className="h-[360px] md:h-[460px] w-full object-cover"
                        />
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col justify-center">
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-3">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950 leading-tight mb-4">
                            {productName}
                        </h1>

                        <div className="mb-4 text-2xl md:text-3xl font-bold text-amber-700">
                            {productPrice.toLocaleString()} đ
                        </div>

                        <p className="mb-4 text-sm text-gray-600">
                            Còn lại{" "}
                            <span className="font-bold text-gray-950">
                                {stockQuantity}
                            </span>{" "}
                            sản phẩm
                        </p>

                        <p className="mb-7 text-sm md:text-base leading-7 text-gray-600">
                            {productDescription || "Chưa có mô tả sản phẩm."}
                        </p>

                        {/* QUANTITY */}
                        <div className="mb-7">
                            <p className="mb-3 text-sm font-semibold text-gray-700">
                                Số lượng
                            </p>

                            <div className="flex w-fit items-center overflow-hidden rounded-full border border-gray-200 bg-[#faf7f1]">
                                <button
                                    type="button"
                                    onClick={decrease}
                                    className="h-10 w-10 text-lg hover:bg-amber-100 transition"
                                >
                                    -
                                </button>

                                <div className="flex h-10 w-14 items-center justify-center text-sm font-bold">
                                    {qty}
                                </div>

                                <button
                                    type="button"
                                    onClick={increase}
                                    className="h-10 w-10 text-lg hover:bg-amber-100 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={addToCart}
                                disabled={stockQuantity <= 0}
                                className="flex-1 rounded-full bg-gray-950 px-7 py-3 text-sm font-bold text-white hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                🛒 Thêm vào giỏ
                            </button>

                            <button
                                type="button"
                                onClick={buyNow}
                                disabled={stockQuantity <= 0}
                                className="flex-1 rounded-full bg-amber-500 px-7 py-3 text-sm font-bold text-white hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}