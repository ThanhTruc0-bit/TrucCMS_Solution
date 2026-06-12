import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import CategoryMenu from "../components/CategoryMenu";
import ProductGrid from "../components/ProductGrid"; // ✅ dùng cái này
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";

export default function Home() {
    return (
        <div style={{ fontFamily: "serif", background: "#fafafa" }}>

            <Header />

            <HeroBanner />

            <CategoryMenu />

            {/* ✅ SẢN PHẨM */}
            <ProductGrid />

            {/* ✅ BÀI VIẾT */}
            <BlogSection />

            <Footer />

        </div>
    );
}