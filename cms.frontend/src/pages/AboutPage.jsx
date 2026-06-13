import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AboutPage() {
    return (
        <div style={{ fontFamily: "serif", background: "#fafafa" }}>

            <Header />

            {/* HERO */}
            <div style={styles.hero}>
                <h1>VỀ CHÚNG TÔI</h1>
                <p>
                    Luxury Jewelry – Nơi tôn vinh vẻ đẹp và sự tinh tế
                </p>
            </div>

            {/* CONTENT */}
            <div style={styles.container}>

                <section style={styles.section}>
                    <h2>✨ Câu chuyện thương hiệu</h2>
                    <p>
                        Luxury Jewelry được thành lập với sứ mệnh mang đến
                        những sản phẩm trang sức tinh xảo, sang trọng và mang
                        đậm dấu ấn cá nhân.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2>💎 Sứ mệnh</h2>
                    <p>
                        Chúng tôi tin rằng trang sức không chỉ là phụ kiện,
                        mà còn là cách thể hiện phong cách và câu chuyện của
                        mỗi người.
                    </p>
                </section>

                <section style={styles.section}>
                    <h2>🌟 Giá trị cốt lõi</h2>

                    <ul style={styles.list}>
                        <li>✔ Chất lượng cao cấp</li>
                        <li>✔ Thiết kế tinh tế</li>
                        <li>✔ Khách hàng là trung tâm</li>
                        <li>✔ Luôn đổi mới sáng tạo</li>
                    </ul>
                </section>

                {/* STATS */}
                <div style={styles.stats}>
                    <div style={styles.box}>
                        <h3>10+</h3>
                        <p>Năm kinh nghiệm</p>
                    </div>

                    <div style={styles.box}>
                        <h3>5.000+</h3>
                        <p>Sản phẩm đã bán</p>
                    </div>

                    <div style={styles.box}>
                        <h3>3.000+</h3>
                        <p>Khách hàng tin tưởng</p>
                    </div>
                </div>

            </div>

            <Footer />

        </div>
    );
}

/* STYLE */
const styles = {
    hero: {
        height: "300px",
        background: "linear-gradient(135deg, #111, #333)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    },

    container: {
        padding: "60px 80px"
    },

    section: {
        marginBottom: 40
    },

    list: {
        paddingLeft: 20,
        lineHeight: 2
    },

    stats: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: 60,
        gap: 20
    },

    box: {
        flex: 1,
        background: "#fff",
        padding: 30,
        borderRadius: 12,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
    }
};