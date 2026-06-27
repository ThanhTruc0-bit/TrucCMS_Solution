import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="120" cy="95" r="34" fill="#d1d5db"/>
            <rect x="68" y="155" width="104" height="12" rx="6" fill="#d1d5db"/>
            <text x="50%" y="195" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="15" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const data = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(data);
    };

    const getImage = (url) => {
        if (!url) return NO_IMAGE;

        const image = fixImageUrl(url);
        return image || NO_IMAGE;
    };

    const updateQty = (id, change) => {
        const newCart = cart.map((item) => {
            if (Number(item.id) === Number(id)) {
                return {
                    ...item,
                    quantity: Math.max(1, Number(item.quantity || 1) + change),
                };
            }

            return item;
        });

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const removeItem = (id) => {
        const newCart = cart.filter(
            (item) => Number(item.id) !== Number(id)
        );

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const getTotal = () => {
        return cart.reduce(
            (total, item) =>
                total + Number(item.price || 0) * Number(item.quantity || 0),
            0
        );
    };

    const getTotalQuantity = () => {
        return cart.reduce(
            (total, item) => total + Number(item.quantity || 0),
            0
        );
    };

    if (cart.length === 0) {
        return (
            <>
                <Header />

                <main className="min-h-[70vh] bg-[#f8f4ed] flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-amber-100 p-7 text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
                            🛍️
                        </div>

                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl font-bold text-gray-950 mb-3">
                            Your Cart Is Empty
                        </h1>

                        <p className="text-sm text-gray-500 leading-6 mb-6">
                            Add your favorite jewelry items before checkout.
                        </p>

                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* TITLE */}
                    <div className="text-center mb-7">
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
                            Shopping Bag
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Review your selected items before checkout.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-5">
                        {/* CART LIST */}
                        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[3px] text-amber-700 mb-1">
                                        Selected Items
                                    </p>

                                    <h2 className="text-xl font-bold text-gray-950">
                                        Cart Details
                                    </h2>
                                </div>

                                <div className="text-sm text-gray-500">
                                    {cart.length} product(s) / {getTotalQuantity()} item(s)
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center"
                                    >
                                        {/* IMAGE */}
                                        <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shadow-sm flex-shrink-0">
                                            <img
                                                src={getImage(item.imageUrl || item.ImageUrl)}
                                                alt={item.name || item.Name || "product"}
                                                onError={(e) => {
                                                    e.currentTarget.src = NO_IMAGE;
                                                }}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* INFO */}
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-base md:text-lg font-bold text-gray-950 mb-1 line-clamp-2">
                                                {item.name || item.Name}
                                            </h3>

                                            <p className="text-amber-700 text-sm font-semibold mb-4">
                                                {Number(item.price || item.Price || 0).toLocaleString()} đ
                                            </p>

                                            <div className="flex items-center justify-center md:justify-start gap-3">
                                                <div className="flex items-center rounded-full border border-gray-200 overflow-hidden bg-[#faf7f1]">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(item.id || item.Id, -1)}
                                                        className="w-9 h-9 text-base hover:bg-amber-100 transition"
                                                    >
                                                        -
                                                    </button>

                                                    <span className="w-10 h-9 flex items-center justify-center text-sm font-bold">
                                                        {item.quantity || item.Quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() => updateQty(item.id || item.Id, 1)}
                                                        className="w-9 h-9 text-base hover:bg-amber-100 transition"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id || item.Id)}
                                                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* SUBTOTAL */}
                                        <div className="text-center md:text-right min-w-[130px]">
                                            <p className="text-xs text-gray-400 mb-1">
                                                Subtotal
                                            </p>

                                            <p className="text-lg font-bold text-gray-950">
                                                {(
                                                    Number(item.price || item.Price || 0) *
                                                    Number(item.quantity || item.Quantity || 0)
                                                ).toLocaleString()} đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SUMMARY */}
                        <aside className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 h-fit sticky top-28">
                            <p className="text-xs uppercase tracking-[3px] text-amber-700 mb-2">
                                Order Summary
                            </p>

                            <h2 className="text-2xl font-bold text-gray-950 mb-5">
                                Checkout Details
                            </h2>

                            <div className="space-y-3 border-b border-gray-100 pb-5">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Products</span>
                                    <span>{cart.length}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total quantity</span>
                                    <span>{getTotalQuantity()}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-semibold">
                                        Free
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-5">
                                <span className="text-base font-semibold text-gray-700">
                                    Total
                                </span>

                                <span className="text-2xl font-bold text-amber-700">
                                    {getTotal().toLocaleString()} đ
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate("/checkout")}
                                className="w-full py-3 rounded-full bg-gray-950 text-white text-sm font-bold hover:bg-amber-600 transition shadow-md"
                            >
                                Proceed To Checkout
                            </button>

                            <Link
                                to="/shop"
                                className="block text-center mt-4 text-sm text-gray-500 hover:text-amber-700 transition"
                            >
                                Continue Shopping
                            </Link>

                            <p className="mt-5 text-xs text-gray-400 leading-5 text-center">
                                Your jewelry will be carefully prepared before delivery.
                            </p>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}