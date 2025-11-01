import React from "react";
import "../styles/Slider.css";
import stiker from "../assets/stiker.png";
import gelang from "../assets/gelang.png";
import ganci from "../assets/ganci.png";

const Slider = () => {
  return (
    <div className="slider">
      <div className="slide-item">
        <img src={stiker} alt="Stiker" />
        <div className="text">
          <h2>Stiker</h2>
          <p>Desain keren untuk laptop dan botolmu!</p>
        </div>
      </div>
      <div className="slide-item">
        <img src={gelang} alt="Gelang" />
        <div className="text">
          <h2>Gelang</h2>
          <p>Simple dan stylish buat harian kamu.</p>
        </div>
      </div>
      <div className="slide-item">
        <img src={ganci} alt="Ganci" />
        <div className="text">
          <h2>Gantungan Kunci</h2>
          <p>Teman setia kunci motormu!</p>
        </div>
      </div>
    </div>
  );
};

export default Slider;
