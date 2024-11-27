import React, { useState } from "react";

const Slideshow = () => {
  const images = [
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/467735363_122215636064031688_4093773670877885223_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=h2HorWGzqbUQ7kNvgGszqcc&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=ATJB-teJmHenE8qvjd3A_V1&oh=00_AYAbCoMLSnm_FenOCoNFZsILihPcbtvyekWP2T7xhYnALg&oe=674C4DA1", // Placeholder images for slideshow
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/467348871_122215486064031688_1535150998386324181_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=mt62AOfvRikQ7kNvgH44p1A&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=AEykomUtINWr1V8z9esG3yW&oh=00_AYArW32NbiPa94Gyz2BCeSVry8oN2pDtGbwaudzabkoyoQ&oe=674C482A",
    "https://scontent.fmnl31-1.fna.fbcdn.net/v/t39.30808-6/466625802_122214664760031688_3825222108077920134_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=WGQGvDDkl7UQ7kNvgGz59rv&_nc_zt=23&_nc_ht=scontent.fmnl31-1.fna&_nc_gid=A-z2qjgogUFbPYuVA4bgGAq&oh=00_AYAkrVz9614wGAI5eiVJQBXsFu1kwQwLTEFw-bj4ykSBMA&oe=674C5F22",
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
