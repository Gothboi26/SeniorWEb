import React, { useState, useEffect, useRef } from "react";
import "./OfficialsHomepage.css";
import boy from './assets/boy.png';
import girl from './assets/girl.png';
import leftarrow from './assets/redleft.png';
import rightarrow from './assets/redright.png';

const Officials = () => {
    const officials = [
        { name: "Ferrer, Rizalino", position: "Punong Barangay", img: boy },
        { name: "Matos, Rica", position: "Kagawad", img: girl },
        { name: "De Gula, Susan", position: "Kagawad", img: girl },
        { name: "Dela Cruz, Zella", position: "Kagawad", img: girl },
        { name: "Moises, Beltran", position: "Kagawad", img: boy },
        { name: "Bernardino, Bogie", position: "Kagawad", img: boy },
        { name: "Edgardo, Dizon", position: "Kagawad", img: boy },
        { name: "Colibao, Shennel", position: "Kagawad", img: girl },
    ];

    const visibleSlides = 3;
    const totalSlides = officials.length;
    const [currentIndex, setCurrentIndex] = useState(visibleSlides);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef(null);

    // Extended slides for smooth infinite loop
    const extendedSlides = [
        ...officials.slice(-visibleSlides),
        ...officials,
        ...officials.slice(0, visibleSlides)
    ];

    const slideWidthPercentage = 100 / visibleSlides;

    useEffect(() => {
        const ref = carouselRef.current;

        const handleTransitionEnd = () => {
            setIsTransitioning(false);

            if (currentIndex >= totalSlides + visibleSlides) {
                ref.style.transition = "none";
                setCurrentIndex(visibleSlides);
                ref.style.transform = `translateX(-${visibleSlides * slideWidthPercentage}%)`;
            } else if (currentIndex <= 0) {
                ref.style.transition = "none";
                setCurrentIndex(totalSlides);
                ref.style.transform = `translateX(-${totalSlides * slideWidthPercentage}%)`;
            }

            requestAnimationFrame(() => {
                ref.style.transition = "transform 0.5s ease-in-out";
            });
        };

        ref.addEventListener("transitionend", handleTransitionEnd);
        return () => {
            ref.removeEventListener("transitionend", handleTransitionEnd);
        };
    }, [currentIndex, totalSlides, visibleSlides, slideWidthPercentage]);

    const handleNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    };

    const handlePrev = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
    };

    return (
        <div className="barangay-health-officials">
            <div className="officials-header">
                <p className="officials-subheader">OFFICIALS</p>
                <h1 className="officials-title">Our Barangay Health Officials</h1>
            </div>
            <div className="container">
                <button className="carousel-btn prev" onClick={handlePrev}>
                    <img src={leftarrow} alt="Previous" />
                </button>
                <div className="card-wrapper">
                    <ul
                        className="card-list"
                        ref={carouselRef}
                        style={{
                            transform: `translateX(-${currentIndex * slideWidthPercentage}%)`,
                            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
                        }}
                    >
                        {extendedSlides.map((official, index) => {
                            // Check if the slide is visible
                            const isVisible = 
                                index >= currentIndex && index < currentIndex + visibleSlides;
                            return (
                                <li
                                    className={`card-item ${isVisible ? "visible" : ""}`}
                                    key={index}
                                >
                                    <div className="official-card">
                                        <img src={official.img} alt="brgy-official" className="official-image" />
                                        <p className="official-name">{official.name}</p>
                                        <p className="official-position">{official.position}</p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <button className="carousel-btn next" onClick={handleNext}>
                    <img src={rightarrow} alt="Next" />
                </button>
            </div>
        </div>
    );
};

export default Officials;
