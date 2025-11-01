import React from "react";
import { Link } from "react-router-dom";

export default function SlideItem({ title, subtitle, desc, image, id }) {
  return (
    <div className="slide-item">
      <div className="slide-text">
        <h4>{subtitle}</h4>
        <h1>{title}</h1>
        <p>{desc}</p>
        <Link to={`/product/${id}`} className="see-more">SEE MORE →</Link>
      </div>
      <div className="slide-image">
        <img src={image} alt={title} />
      </div>
    </div>
  );
}
