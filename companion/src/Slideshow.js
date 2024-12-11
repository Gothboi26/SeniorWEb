import React, { useState, useEffect, useCallback } from "react";

const Slideshow = () => {
  const images = [
    "https://scontent.fmnl9-1.fna.fbcdn.net/v/t39.30808-6/467735363_122215636064031688_4093773670877885223_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEiQCZ_21OAUZWg8UjrgA-m2QMDhr89TTPZAwOGvz1NM-Kl7p3ySaKTYO_5P0IlsEhi2PVSSjetqBFcjKdpYaMU&_nc_ohc=B-qHFszS_UYQ7kNvgHCibiQ&_nc_zt=23&_nc_ht=scontent.fmnl9-1.fna&_nc_gid=Agjj8HPSAQ8hCu3wMcwtLFA&oh=00_AYCoYpQ8YuuWPafJO6ZDUbnMwP7IZcwsBrUPwhUObVcajg&oe=675FA3A1",
    "https://scontent.fmnl9-7.fna.fbcdn.net/v/t39.30808-6/463895454_122210731580031688_4559676307604075176_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeFUdk97qkkOWFlTmJn3V3x6ucsGaV1Swr25ywZpXVLCvX7R1U8xi0njtTrAgjYLAkgXFz8_3Wz7zuvIuDPeQsmd&_nc_ohc=18nOygewb5oQ7kNvgG_0d9H&_nc_zt=23&_nc_ht=scontent.fmnl9-7.fna&_nc_gid=ASuIFTrBCSlsGsb2IUkvlFV&oh=00_AYCtNBq5HCbs0RzdJkW8pGV5PyougO3BbOZa7V-Ij4wP0w&oe=675F978E",
    "https://scontent.fmnl9-1.fna.fbcdn.net/v/t39.30808-6/466122430_122213764550031688_3542983988034282598_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGns42Z8XVZkgW71vdbV_MwotMEMySiW7Ci0wQzJKJbsOWvzraIQLEOUtP4_31p3IEL4sLg0KGw2hrm9hogWcbN&_nc_ohc=CSDB5qyPa0cQ7kNvgGeWfq5&_nc_zt=23&_nc_ht=scontent.fmnl9-1.fna&_nc_gid=AFfYs4kaslfAhN-W2O23Kq_&oh=00_AYDv2P1iOcRHnxKtzVBWw3kDlMsjbVA8W5njQKX43PRGlg&oe=675F7E41",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval);
  }, [nextSlide]);

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
