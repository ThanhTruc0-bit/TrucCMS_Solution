import { BrowserRouter, Routes, Route } from "react-router-dom";

// HOME
import Home from "./pages/home/Home";

// BLOG
import BlogPage from "./pages/blog/BlogPage";
import PostDetail from "./pages/blog/PostDetail";

// PRODUCT
import ProductDetail from "./pages/product-detail/ProductDetail";

// SHOP
import Shop from "./pages/shop/shop";

// CART + CHECKOUT
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";

// AUTH + OTHER
import Register from "./pages/Register";
import Login from "./pages/Login";
import AboutPage from "./pages/AboutPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/shop" element={<Shop />} />

                <Route path="/product/:id" element={<ProductDetail />} />

                <Route path="/blog" element={<BlogPage />} />
                <Route path="/post/:id" element={<PostDetail />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/about" element={<AboutPage />} />

                <Route path="/order-success/:id" element={<OrderSuccess />} />
                <Route path="/my-orders" element={<MyOrders />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;