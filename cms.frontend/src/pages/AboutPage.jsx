import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] font-sans text-gray-800">
            <Header />

            {/* HERO */}
            <section className="h-[300px] bg-gradient-to-br from-gray-950 to-gray-800 text-white flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-wide mb-4">
                    ABOUT US
                </h1>

                <p className="text-lg md:text-xl text-gray-200">
                    Luxury Jewelry - Where beauty and elegance are celebrated
                </p>
            </section>

            {/* CONTENT */}
            <main className="max-w-7xl mx-auto px-6 md:px-20 py-16">
                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Brand Story
                    </h2>

                    <p className="text-gray-600 leading-8 text-lg">
                        Luxury Jewelry was founded with the mission of bringing
                        customers elegant, refined, and meaningful jewelry
                        products that reflect personal style.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Our Mission
                    </h2>

                    <p className="text-gray-600 leading-8 text-lg">
                        We believe jewelry is not only an accessory, but also a
                        way to express individuality, confidence, and personal
                        stories.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Core Values
                    </h2>

                    <ul className="space-y-3 text-gray-600 text-lg">
                        <li>✔ Premium quality</li>
                        <li>✔ Elegant design</li>
                        <li>✔ Customer-first service</li>
                        <li>✔ Continuous creativity and innovation</li>
                    </ul>
                </section>

                {/* STATS */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:-translate-y-1 transition duration-300">
                        <h3 className="text-4xl font-bold text-amber-500 mb-3">
                            10+
                        </h3>

                        <p className="text-gray-600 font-medium">
                            Years of Experience
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:-translate-y-1 transition duration-300">
                        <h3 className="text-4xl font-bold text-amber-500 mb-3">
                            5,000+
                        </h3>

                        <p className="text-gray-600 font-medium">
                            Products Sold
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl text-center shadow-lg hover:-translate-y-1 transition duration-300">
                        <h3 className="text-4xl font-bold text-amber-500 mb-3">
                            3,000+
                        </h3>

                        <p className="text-gray-600 font-medium">
                            Trusted Customers
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}