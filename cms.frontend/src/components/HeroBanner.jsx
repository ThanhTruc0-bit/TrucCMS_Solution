import { useEffect, useState } from "react";

const BASE = "https://localhost:7194";

export default function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [index, setIndex] = useState(0);

    // LOAD DATA
    useEffect(() => {
        fetch(`${BASE}/api/Advertisements`)
            .then(res => res.json())
            .then(data => setBanners(data))
            .catch(err => console.log("Banner error:", err));
    }, []);

    // AUTO SLIDE
    useEffect(() => {
        if (!banners.length) return;

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [banners.length]);

    // SAFE CURRENT ITEM
    const current = banners[index];

    // FIX IMAGE PATH
    const fixUrl = (url) => {
        if (!url) return "";
        return url.startsWith("/") ? url : "/" + url;
    };

    // LOADING STATE
    if (!banners.length) {
        return (
            <div style={{ height: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
                Đang tải banner...
            </div>
        );
    }

    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: "500px",
            overflow: "hidden"
        }}>

            {/* SLIDES */}
            {banners.map((b, i) => (
                <img
                    key={b.id}
                    src={`${BASE}${fixUrl(b.imageUrl)}`}
                    alt={b.title || "banner"}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        top: 0,
                        left: 0,
                        opacity: i === index ? 1 : 0,
                        transition: "opacity 1s ease"
                    }}
                />
            ))}

            {/* DARK OVERLAY */}
            <div style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)"
            }} />

            {/* TEXT CONTENT */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "10%",
                transform: "translateY(-50%)",
                color: "#fff",
                maxWidth: "500px"
            }}>
                <h1 style={{
                    fontSize: 42,
                    fontWeight: "bold",
                    marginBottom: 15,
                    letterSpacing: 2
                }}>
                    {current?.title}
                </h1>

                <p style={{
                    fontSize: 18,
                    opacity: 0.9,
                    marginBottom: 20
                }}>
                    {current?.description}
                </p>

                <button style={{
                    padding: "10px 25px",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: 30,
                    cursor: "pointer",
                    fontWeight: "bold"
                }}>
                    KHÁM PHÁ NGAY
                </button>
            </div>

            {/* DOTS */}
            <div style={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 10
            }}>
                {banners.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: i === index ? "#fff" : "#888",
                            cursor: "pointer"
                        }}
                    />
                ))}
            </div>

        </div>
    );
}