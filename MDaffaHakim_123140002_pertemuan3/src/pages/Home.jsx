import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

// pastikan file gambar ada di src/assets dengan nama sesuai
import hero1 from "../assets/hero1.png";
import hero2 from "../assets/hero2.png";
import hero3 from "../assets/hero3.png";

const slides = [
  {
    id: 1,
    title: "Stiker BUMH",
    subtitle: "DESIGN SLIDER",
    desc: "Stiker vinyl berkualitas, tahan air, cocok untuk laptop & botol minum.",
    image: hero1,
    bg: "linear-gradient(120deg,#f5f0ff,#fff1f7)",
  },
  {
    id: 2,
    title: "Gelang Karet BUMH",
    subtitle: "DESIGN SLIDER",
    desc: "Gelang karet eksklusif dengan desain modern — simbol kebanggaan himpunan.",
    image: hero2,
    bg: "linear-gradient(120deg,#e0f7f4,#eef8ff)",
  },
  {
    id: 3,
    title: "Gantungan Kunci",
    subtitle: "DESIGN SLIDER",
    desc: "Ganci akrilik full-print, cocok jadi souvenir event kampus.",
    image: hero3,
    bg: "linear-gradient(120deg,#fff6e6,#fff0f0)",
  },
];

export default function Home() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % slides.length);
        setFade(true);
      }, 350);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setIdx((i) => (i - 1 + slides.length) % slides.length);
      setFade(true);
    }, 200);
  };

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setIdx((i) => (i + 1) % slides.length);
      setFade(true);
    }, 200);
  };

  const goToProducts = () => {
    navigate("/products"); // <- navigasi aman ke halaman products
  };

  const slide = slides[idx];

  return (
    <section
      className="hero-section"
      style={{ background: slide.bg, transition: "background 0.8s ease" }}
    >
      <div className="hero-inner container">
        <div className={`hero-left ${fade ? "fade-in" : "fade-out"}`}>
          <div className="hero-subtitle">{slide.subtitle}</div>
          <h1 className="hero-title">{slide.title}</h1>
          <p className="hero-desc">{slide.desc}</p>

          <div className="hero-actions">
            <button className="see-more" onClick={goToProducts}>
              Lihat Produk →
            </button>
            <button className="ghost" onClick={() => alert("Feature Coming Soon!")}>
              Contact
            </button>
          </div>
        </div>

        <div className={`hero-right ${fade ? "fade-in" : "fade-out"}`}>
          <div className="hero-image-wrap">
            <img src={slide.image} alt={slide.title} className="hero-main" />
            {/* decorative blurred images (use previous/next slides lightly) */}
            <img
              src={slides[(idx + 1) % slides.length].image}
              alt="blur"
              className="hero-blur hero-blur-right"
            />
            <img
              src={slides[(idx - 1 + slides.length) % slides.length].image}
              alt="blur"
              className="hero-blur hero-blur-left"
            />
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="hero-controls">
        <button className="ctrl" onClick={prev} aria-label="previous">‹</button>
        <div className="dots">
          {slides.map((s, i) => (
            <button
              key={s.id}
              className={`dot ${i === idx ? "active" : ""}`}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setIdx(i);
                  setFade(true);
                }, 200);
              }}
              aria-label={`goto-${i}`}
            />
          ))}
        </div>
        <button className="ctrl" onClick={next} aria-label="next">›</button>
      </div>
    </section>
  );
}
