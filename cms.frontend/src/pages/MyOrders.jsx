import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config/appConfig";

export default function MyOrders() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?.customerId) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE_URL}/api/orders/customer/${user.customerId}`
            );

            const data = await res.json();

            const list = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : [];

            setOrders(list);
        } catch (err) {
            console.log("Order history error:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status) => {
        if (status === 0) return "Pending";
        if (status === 1) return "Shipping";
        if (status === 2) return "Completed";
        return "Unknown";
    };

    const getStatusStyle = (status) => {
        if (status === 0) return "bg-yellow-100 text-yellow-700";
        if (status === 1) return "bg-blue-100 text-blue-700";
        if (status === 2) return "bg-emerald-100 text-emerald-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-[#f8f4ed] px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* TITLE */}
                    <div className="text-center mb-7">
                        <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                            Luxury Jewelry
                        </p>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-950">
                            My Orders
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            Track your jewelry orders and review your purchase history.
                        </p>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-7 text-center text-sm text-gray-500">
                            Loading orders...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-7 md:p-9 text-center">
                            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl">
                                📦
                            </div>

                            <p className="text-xs uppercase tracking-[4px] text-amber-700 mb-2">
                                Order History
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-3">
                                No Orders Yet
                            </h2>

                            <p className="text-sm text-gray-500 mb-6">
                                You have not placed any orders yet.
                            </p>

                            <Link
                                to="/shop"
                                className="inline-flex px-7 py-3 rounded-full bg-gray-950 text-white text-sm font-semibold hover:bg-amber-600 transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const orderId = order.id || order.Id;
                                const orderDate = order.orderDate || order.OrderDate;
                                const status = order.status ?? order.Status;
                                const totalAmount =
                                    order.totalAmount || order.TotalAmount || 0;
                                const details =
                                    order.details || order.Details || [];

                                return (
                                    <section
                                        key={orderId}
                                        className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden"
                                    >
                                        {/* ORDER HEADER */}
                                        <div className="px-5 py-4 bg-gradient-to-r from-white via-[#fffaf1] to-[#f4e6c8] border-b border-amber-100">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-[3px] text-amber-700 mb-1">
                                                        Order ID
                                                    </p>

                                                    <h2 className="text-2xl font-bold text-gray-950">
                                                        #{orderId}
                                                    </h2>
                                                </div>

                                                <div className="text-left md:text-center">
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Order Date
                                                    </p>

                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderDate
                                                            ? new Date(orderDate).toLocaleString()
                                                            : "N/A"}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`w-fit px-4 py-2 rounded-full text-xs font-bold ${getStatusStyle(status)}`}
                                                >
                                                    {getStatusText(status)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* ORDER BODY */}
                                        <div className="p-5">
                                            <div className="space-y-3">
                                                {details.length === 0 ? (
                                                    <div className="rounded-xl bg-[#faf7f1] px-4 py-3 text-sm text-gray-500 text-center">
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
                                                                className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl bg-[#faf7f1] px-4 py-3"
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
                                                                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-700 border border-gray-100">
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

                                            <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Total Amount
                                                    </p>

                                                    <p className="text-2xl font-bold text-amber-700">
                                                        {Number(totalAmount).toLocaleString()} đ
                                                    </p>
                                                </div>

                                                <Link
                                                    to={`/order-success/${orderId}`}
                                                    className="w-fit rounded-full bg-gray-950 text-white px-6 py-2.5 text-sm font-semibold hover:bg-amber-600 transition"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}