import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { API_BASE_URL, fixImageUrl } from "../../config/appConfig";

const NO_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <rect width="100%" height="100%" fill="#f3f4f6"/>
            <circle cx="100" cy="78" r="28" fill="#d1d5db"/>
            <rect x="55" y="128" width="90" height="10" rx="5" fill="#d1d5db"/>
            <text x="50%" y="165" dominant-baseline="middle" text-anchor="middle"
                fill="#9ca3af" font-size="13" font-family="Arial">
                No Image
            </text>
        </svg>
    `);

export default function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        note: ""
    });

    useEffect(() => {
        const cartData = JSON.parse(localStorage.getItem("cart")) || [];
        const user = JSON.parse(localStorage.getItem("user"));

        setCart(cartData);

        if (user) {
            setForm((prev) => ({
                ...prev,
                fullName: user.fullName || user.name || user.username || "",
                email: user.email || user.Email || "",
                phone:
                    user.phone ||
                    user.phoneNumber ||
                    user.Phone ||
                    user.PhoneNumber ||
                    user.mobile ||
                    "",
                address: user.address || user.Address || ""
            }));
        }
    }, []);

    const getImage = (url) => {
        if (!url) return NO_IMAGE;

        const image = fixImageUrl(url);
        return image || NO_IMAGE;
    };

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const total = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price || item.Price || 0) *
            Number(item.quantity || item.Quantity || 0),
        0
    );

    const totalQuantity = cart.reduce(
        (sum, item) => sum + Number(item.quantity || item.Quantity || 0),
        0
    );

    const handleOrder = async () => {
        setError("");

        if (cart.length === 0) {
            setError("Cart is empty.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.customerId) {
            setError("Please login before checkout.");
            navigate("/login");
            return;
        }

        if (!form.fullName.trim()) {
            setError("Customer name is missing.");
            return;
        }

        if (!form.email.trim()) {
            setError("Customer email is missing.");
            return;
        }

        if (!form.phone.trim()) {
            setError("Customer phone is missing.");
            return;
        }

        if (!form.address.trim()) {
            setError("Please enter delivery address.");
            return;
        }

        const orderData = {
            customerId: user.customerId,
            notes: `Name: ${form.fullName} | Email: ${form.email} | Phone: ${form.phone} | Address: ${form.address} | Note: ${form.note}`,
            items: cart.map((i) => ({
                productId: i.id || i.Id,
                quantity: Number(i.quantity || i.Quantity || 1)
            }))
        };

        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Order failed.");
                return;
            }

            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartUpdated"));

            navigate(`/order-success/${data.orderId || data.OrderId}`);
        } catch (err) {
            console.log(err);
            setError("Server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* TITLE */}
                    <div className="text-center mb-7">
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Secure Checkout
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
                            Complete Your Order
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Your account information is filled automatically. Please enter your delivery address.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-5">
                        {/* CUSTOMER FORM */}
                        <section className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-100">
                                <p className="text-xs uppercase tracking-[3px] text-amber-700 mb-1">
                                    Customer Information
                                </p>

                                <h2 className="text-xl font-bold text-gray-950">
                                    Delivery Details
                                </h2>
                            </div>

                            <div className="p-5">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name
                                        </label>

                                        <input
                                            name="fullName"
                                            value={form.fullName}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 outline-none text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>

                                        <input
                                            name="phone"
                                            value={form.phone}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 outline-none text-sm"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email
                                        </label>

                                        <input
                                            name="email"
                                            value={form.email}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 outline-none text-sm"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Delivery Address
                                        </label>

                                        <input
                                            name="address"
                                            placeholder="Enter your delivery address..."
                                            value={form.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Note
                                        </label>

                                        <textarea
                                            name="note"
                                            placeholder="Optional note for your order..."
                                            rows="4"
                                            value={form.note}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none resize-none text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm font-medium">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={handleOrder}
                                        disabled={loading}
                                        className="flex-1 py-3 rounded-full bg-gray-950 text-white text-sm font-bold hover:bg-amber-600 transition disabled:opacity-60"
                                    >
                                        {loading ? "Processing..." : "Place Order"}
                                    </button>

                                    <Link
                                        to="/cart"
                                        className="flex-1 text-center py-3 rounded-full border border-gray-300 text-gray-900 text-sm font-bold hover:border-amber-500 hover:text-amber-600 transition"
                                    >
                                        Back To Cart
                                    </Link>
                                </div>
                            </div>
                        </section>

                        {/* ORDER SUMMARY */}
                        <aside className="bg-white rounded-2xl shadow-lg border border-amber-100 p-5 h-fit sticky top-28">
                            <p className="text-xs uppercase tracking-[3px] text-amber-700 mb-2">
                                Order Review
                            </p>

                            <h2 className="text-2xl font-bold text-gray-950 mb-5">
                                Your Jewelry
                            </h2>

                            <div className="space-y-4 max-h-[330px] overflow-y-auto pr-1">
                                {cart.map((item, index) => {
                                    const name = item.name || item.Name;
                                    const imageUrl = item.imageUrl || item.ImageUrl;
                                    const quantity = item.quantity || item.Quantity || 0;
                                    const price = item.price || item.Price || 0;

                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-3 border-b border-gray-100 pb-4"
                                        >
                                            <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={getImage(imageUrl)}
                                                    alt={name || "product"}
                                                    onError={(e) => {
                                                        e.currentTarget.src = NO_IMAGE;
                                                    }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-gray-950 leading-5 line-clamp-2">
                                                    {name}
                                                </h3>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    Quantity: {quantity}
                                                </p>

                                                <p className="text-sm text-amber-700 font-bold mt-1">
                                                    {(Number(price) * Number(quantity)).toLocaleString()} đ
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Products</span>
                                    <span>{cart.length}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Total quantity</span>
                                    <span>{totalQuantity}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-emerald-600 font-semibold">
                                        Free
                                    </span>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <span className="text-base font-semibold text-gray-700">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold text-amber-700">
                                        {total.toLocaleString()} đ
                                    </span>
                                </div>
                            </div>

                            <p className="mt-5 text-xs text-gray-400 leading-5 text-center">
                                Your jewelry will be confirmed and prepared carefully.
                            </p>
                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}