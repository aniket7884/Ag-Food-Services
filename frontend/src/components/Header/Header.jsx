import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="hero">
  <div className="hero-left">
    <h1>Fresh. Fast. Delicious.</h1>
    <p>
      Enjoy premium dishes from top restaurants, delivered hot & fresh 
      right to your doorstep. Explore flavors crafted to delight your senses.
    </p>
    <button>Order Now</button>
  </div>

  <div className="hero-right">
    <img src="/header_img.png" alt="Food Banner" />
  </div>
</div>

  );
};

export default Header;
