import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Shop from "./pages/shop";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import OrderSuccess from "./pages/OrderSuccess";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Home />} />
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/product/:id" element={<ProductDetail />} />

                <Route path="/shop" element={<Shop />} />

                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/blog" element={<BlogPage />} />

                <Route path="/about" element={<AboutPage />} />

                <Route path="/order-success/:id" element={<OrderSuccess />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;