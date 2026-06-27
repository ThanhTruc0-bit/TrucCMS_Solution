import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-300">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* BRAND */}
                <div>
                    <h2 className="text-2xl font-bold text-amber-500">
                        Luxury Jewelry
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-400">
                        Premium jewelry for elegant, modern and timeless beauty.
                    </p>
                </div>

                {/* MENU */}
                <div>
                    <h3 className="text-base font-semibold text-white mb-4">
                        Menu
                    </h3>

                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-amber-500 transition"
                            >
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/shop"
                                className="hover:text-amber-500 transition"
                            >
                                Shop
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/blog"
                                className="hover:text-amber-500 transition"
                            >
                                Blog
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/about"
                                className="hover:text-amber-500 transition"
                            >
                                About Us
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* SUPPORT */}
                <div>
                    <h3 className="text-base font-semibold text-white mb-4">
                        Support
                    </h3>

                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Warranty Policy</li>
                        <li>Return Policy</li>
                        <li>Shopping Guide</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className="text-base font-semibold text-white mb-4">
                        Contact
                    </h3>

                    <div className="space-y-2 text-sm text-gray-400">
                        <p>📍 Ho Chi Minh City</p>
                        <p>📞 0123 456 789</p>
                        <p>✉ luxuryjewelry@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
                    <p>
                        © 2026 Luxury Jewelry. All rights reserved.
                    </p>

                    <div className="flex gap-5">
                        <span className="hover:text-amber-500 cursor-pointer transition">
                            Facebook
                        </span>

                        <span className="hover:text-amber-500 cursor-pointer transition">
                            Instagram
                        </span>

                        <span className="hover:text-amber-500 cursor-pointer transition">
                            TikTok
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}