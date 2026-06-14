import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import CategoryMenu from "../components/CategoryMenu";
import ProductGrid from "../components/ProductGrid"; 
import BlogSection from "../components/BlogSection";
import Footer from "../components/Footer";
import LatestProducts from "../components/LatestProducts";
import HotProducts from "../components/HotProducts";

export default function Home() {
    return (
        <div style={{ fontFamily: "serif", background: "#fafafa" }}>

            <Header />

            <HeroBanner />

            <CategoryMenu />



            <HotProducts />
            <LatestProducts />

            {/* ✅ SẢN PHẨM */}
            <ProductGrid />

            {/* ✅ BÀI VIẾT */}
            <BlogSection />

            <Footer />

        </div>
    );
}