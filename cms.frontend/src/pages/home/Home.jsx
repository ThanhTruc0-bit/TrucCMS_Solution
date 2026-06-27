import Header from "../../components/Header";
import HeroBanner from "../../components/HeroBanner";
import CategoryMenu from "../../components/CategoryMenu";
import ProductGrid from "../../components/ProductGrid";
import BlogSection from "../../components/BlogSection";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProducts";
import HotProducts from "../../components/HotProducts";

export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 font-serif">

            <Header />

            <main>

                <HeroBanner />

                <section className="py-12">
                    <CategoryMenu />
                </section>

                <section className="py-12">
                    <HotProducts />
                </section>

                <section className="py-12">
                    <LatestProducts />
                </section>

                <section className="py-12">
                    <ProductGrid />
                </section>

                <section className="py-12">
                    <BlogSection />
                </section>

            </main>

            <Footer />

        </div>
    );
}