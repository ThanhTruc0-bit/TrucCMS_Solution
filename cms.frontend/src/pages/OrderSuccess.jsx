import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/appConfig";

export default function OrderSuccess() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${API_BASE_URL}/api/orders/${id}`);
            const data = await res.json();

            if (!res.ok) {
                setOrder(null);
                return;
            }

            setOrder(data);
        } catch (err) {
            console.log("Order success error:", err);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const details = order?.details || order?.Details || [];

    const orderId = order?.id || order?.Id;
    const orderDate = order?.orderDate || order?.OrderDate;
    const status = order?.status ?? order?.Status ?? 0;

    const total = details.reduce(
        (sum, item) =>
            sum +
            Number(item.unitPrice || item.UnitPrice || 0) *
            Number(item.quantity || item.Quantity || 0),
        0
    );

    const getStatusText = (value) => {
        if (value === 0) return "Pending";
        if (value === 1) return "Shipping";
        if (value === 2) return "Completed";
        return "Pending";
    };

    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-[70vh] bg-[#f8f4ed] flex items-center justify-center px-4 py-10">
                    <div className="bg-white rounded-2xl shadow-lg border border-amber-100 px-8 py-6 text-sm text-gray-500">
                        Loading order...
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (!order) {
        return (
            <>
                <Header />

                <main className="min-h-[70vh] bg-[#f8f4ed] flex items-center justify-center px-4 py-10">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-red-100 p-7 text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-3xl">
                            ⚠️
                        </div>

                        <h1 className="text-2xl font-bold text-gray-950 mb-3">
                            Order Not Found
                        </h1>

                        <p className="text-sm text-gray-500 mb-6">
                            We could not find this order information.
                        </p>

                        <Link
                            to="/"
                            className="inline-flex px-7 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                        >
                            Back Home
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
                <div className="max-w-5xl mx-auto">
                    {/* SUCCESS CARD */}
                    <section className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
                        {/* TOP */}
                        <div className="px-5 md:px-8 py-8 text-center bg-gradient-to-br from-white via-[#fffaf1] to-[#f4e6c8] border-b border-amber-100">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl text-emerald-700 font-bold">
                                ✓
                            </div>

                            <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                                Luxury Jewelry
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">
                                Order Placed Successfully
                            </h1>

                            <p className="text-sm text-gray-600 max-w-xl mx-auto leading-6">
                                Thank you for your purchase. Your jewelry order has been received and will be prepared carefully.
                            </p>

                            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 shadow-sm border border-amber-100 text-sm">
                                <span className="text-gray-500">
                                    Order ID
                                </span>

                                <span className="font-bold text-amber-700">
                                    #{orderId}
                                </span>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="p-5 md:p-7">
                            {/* INFO BOXES */}
                            <div className="grid md:grid-cols-3 gap-4 mb-7">
                                <div className="rounded-xl bg-[#faf7f1] p-4 border border-amber-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Order Date
                                    </p>

                                    <p className="text-sm font-bold text-gray-950">
                                        {orderDate
                                            ? new Date(orderDate).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#faf7f1] p-4 border border-amber-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Status
                                    </p>

                                    <p className="text-sm font-bold text-amber-700">
                                        {getStatusText(status)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-[#faf7f1] p-4 border border-amber-100">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Total
                                    </p>

                                    <p className="text-sm font-bold text-gray-950">
                                        {total.toLocaleString()} đ
                                    </p>
                                </div>
                            </div>

                            {/* ITEMS */}
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-950">
                                    Order Items
                                </h2>

                                <span className="text-sm text-gray-500">
                                    {details.length} item(s)
                                </span>
                            </div>

                            <div className="space-y-3">
                                {details.length === 0 ? (
                                    <div className="rounded-xl bg-[#faf7f1] px-5 py-4 text-sm text-gray-500 text-center">
                                        No order items found.
                                    </div>
                                ) : (
                                    details.map((item, index) => {
                                        const productId =
                                            item.productId || item.ProductId;
                                        const quantity =
                                            item.quantity || item.Quantity || 0;
                                        const unitPrice =
                                            item.unitPrice || item.UnitPrice || 0;
                                        const productName =
                                            item.productName ||
                                            item.ProductName ||
                                            `Product #${productId}`;

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl bg-[#faf7f1] border border-amber-50 px-5 py-4"
                                            >
                                                <div>
                                                    <p className="text-sm md:text-base font-bold text-gray-950">
                                                        {productName}
                                                    </p>

                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Product ID: #{productId}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 border border-gray-100">
                                                        x{quantity}
                                                    </span>

                                                    <span className="text-sm font-bold text-amber-700">
                                                        {Number(unitPrice).toLocaleString()} đ
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* ACTIONS */}
                            <div className="mt-7 flex flex-col sm:flex-row gap-3">
                                <Link
                                    to="/my-orders"
                                    className="flex-1 text-center rounded-full bg-gray-950 px-7 py-3 text-sm font-bold text-white hover:bg-amber-600 transition"
                                >
                                    View Order History
                                </Link>

                                <Link
                                    to="/shop"
                                    className="flex-1 text-center rounded-full border border-gray-300 px-7 py-3 text-sm font-bold text-gray-900 hover:border-amber-500 hover:text-amber-600 transition"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}