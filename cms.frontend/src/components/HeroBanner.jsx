import { useEffect, useState } from "react";
import { API_BASE_URL, fixImageUrl } from "../config/appConfig";

export default function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/Advertisements`)
            .then((res) => res.json())
            .then((data) => {
                setBanners(Array.isArray(data) ? data : []);
            })
            .catch((err) => console.log("Banner error:", err));
    }, []);

    useEffect(() => {
        if (!banners.length) return;

        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [banners.length]);

    const current = banners[index];

    if (!banners.length) {
        return (
            <div className="h-[460px] flex items-center justify-center text-base text-gray-500 bg-[#f8f4ed]">
                Loading banners...
            </div>
        );
    }

    return (
        <section className="relative h-[460px] md:h-[520px] overflow-hidden">
            {/* IMAGE */}
            {banners.map((b, i) => {
                const imageUrl = b.imageUrl || b.ImageUrl;
                const title = b.title || b.Title || "banner";

                return (
                    <img
                        key={b.id || b.Id || i}
                        src={fixImageUrl(imageUrl)}
                        alt={title}
                        className={`absolute inset-0 w-full h-full object-cover duration-1000 ${i === index ? "opacity-100" : "opacity-0"
                            }`}
                    />
                );
            })}

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/45" />

            {/* CONTENT */}
            <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto w-full px-5 md:px-8">
                    <div className="max-w-lg">
                        <span className="inline-block mb-3 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-white text-xs tracking-[3px] uppercase">
                            Luxury Collection
                        </span>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                            {current?.title || current?.Title}
                        </h1>

                        <p className="text-sm md:text-base text-gray-200 leading-7 mb-7 max-w-md">
                            {current?.description || current?.Description}
                        </p>

                        <button className="px-6 py-3 rounded-full bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 duration-300 shadow-lg">
                            Explore Now
                        </button>
                    </div>
                </div>
            </div>

            {/* DOTS */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        type="button"
                        onClick={() => setIndex(i)}
                        className={`rounded-full duration-300 ${i === index
                                ? "w-8 h-2.5 bg-amber-400"
                                : "w-2.5 h-2.5 bg-white/60 hover:bg-white"
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}