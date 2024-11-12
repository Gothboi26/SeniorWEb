import React, { useState } from "react";

const Slideshow = () => {
  const images = [
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/466126338_122214177608031688_5698828988253055773_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEvl2NLO4Way5iFfb6q0CEGFoKFtCAbg3wWgoW0IBuDfKu8g2WQlkOyxyebcqu1ZwQVOBq4LHI-3qbU0IEES8UB&_nc_ohc=DiPJQxFzYtYQ7kNvgH6Jy3t&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=A8RLeFOWr6HwRKyMy3bucP-&oh=00_AYCxdPNIPQ-5wvD9PezdP0y9xfQu6EP8cfZsiMZ3wUjcnA&oe=673829EE", // Placeholder images for slideshow
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/421866229_122154347546031688_5352368937238246142_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFOWzyg5xwC2CLYexEdqZ0yWNboa0KfAABY1uhrQp8AAMshNnx6XcCuZTbKkR4YHsiD3LaDzqL_AuFUvCOWY-DU&_nc_ohc=2jkGGYa-y0oQ7kNvgFUQj8v&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=AF1XGnuDRgBJP7kOq8Ok20F&oh=00_AYCleEVsc3B6RE-tUsXnB7T_XdmcLLvbaY02y3Qv9gD_5w&oe=673812B7",
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/466122430_122213764550031688_3542983988034282598_n.jpg?stp=dst-jpg_p526x296&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeF9sDzmE0w5APsuOVn6sjhjotMEMySiW7Ci0wQzJKJbsE8sAMePsJH6uUTD_ap8KI8256Tz2YuXolFjgygc0cm6&_nc_ohc=yX1LITXf5gIQ7kNvgE93mGu&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=Au1iN9GTfDeXXjAt4R4RC8Y&oh=00_AYASgJ4XH1vs10cjN8dojSJywLKoo-5nkfTYSa7cnAv2Cg&oe=67382981",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="slideshow">
      <button onClick={prevSlide} className="slide-btn left-btn">
        ←
      </button>

      <a
        href={images[currentIndex]} // Link to the posted image
        target="_blank"
        rel="noopener noreferrer"
        className="slideshow-link"
      >
        <img
          src={images[currentIndex]}
          alt="Slideshow"
          className="slideshow-image"
        />
      </a>

      <button onClick={nextSlide} className="slide-btn right-btn">
        →
      </button>
    </div>
  );
};

export default Slideshow;