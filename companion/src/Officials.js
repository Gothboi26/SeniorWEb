import React, { Component } from "react";
import "./OfficialsHomepage.css";
import kap from "./assets/officials/KAP-RIZALINO.JPG";
import rica from "./assets/officials/KAG-RICA.JPG";
import susan from "./assets/officials/KAG-SUSAN.JPG";
import zell from "./assets/officials/KAG-ZELL.JPG";
import beltran from "./assets/officials/KAG-MOISES.JPG";
import bogie from "./assets/officials/KAG-BOGIE.JPG";
import ellaine from "./assets/officials/KAG-ELLAINE.JPG";
import edgardo from "./assets/officials/KAG-EDGARDO.JPG";
import shennel from "./assets/officials/KAG-SHENNEL.JPG";
import leftarrow from "./assets/redleft.png";
import rightarrow from "./assets/redright.png";

class Officials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.officials = [
      { name: "Ferrer, Rizalino", position: "Punong Barangay", img: kap },
      { name: "Matos, Rica", position: "Kagawad", img: rica },
      { name: "De Gula, Susan", position: "Kagawad", img: susan },
      { name: "Dela Cruz, Zella", position: "Kagawad", img: zell },
      { name: "Moises, Beltran", position: "Kagawad", img: beltran },
      { name: "Bernardino, Bogie", position: "Kagawad", img: bogie },
      { name: "Manalaysay, Ellaine", position: "Kagawad", img: ellaine },
      { name: "Edgardo, Dizon", position: "Kagawad", img: edgardo },
      { name: "Colibao, Shennel", position: "Kagawad", img: shennel },
    ];
    this.intervalRef = null;
  }

  componentDidMount() {
    this.startAutoSlide();
  }

  componentWillUnmount() {
    clearInterval(this.intervalRef);
  }

  startAutoSlide = () => {
    this.intervalRef = setInterval(() => {
      this.setState((prevState) => ({
        index: (prevState.index + 1) % this.officials.length,
      }));
    }, 3000);
  };

  nextSlide = () => {
    this.setState(
      (prevState) => ({
        index: (prevState.index + 1) % this.officials.length,
      }),
      this.startAutoSlide
    );
  };

  prevSlide = () => {
    this.setState(
      (prevState) => ({
        index:
          (prevState.index - 1 + this.officials.length) % this.officials.length,
      }),
      this.startAutoSlide
    );
  };

  render() {
    const { index } = this.state;
    const prevIndex1 =
      (index - 2 + this.officials.length) % this.officials.length;
    const prevIndex2 =
      (index - 1 + this.officials.length) % this.officials.length;
    const nextIndex1 = (index + 1) % this.officials.length;
    const nextIndex2 = (index + 2) % this.officials.length;

    return (
      <div className="barangay-health-officials">
        <div className="Officials-Header">
          <p className="Officials-Subheader">OFFICIALS</p>
          <h1 className="Officials-Title">Our Barangay Officials</h1>
        </div>

        <div className="card-wrapper">
          <button className="carousel-btn prev" onClick={this.prevSlide}>
            <img src={leftarrow} alt="Previous" />
          </button>

          <div className="card-item prev-item">
            <img
              src={this.officials[prevIndex1].img}
              alt={this.officials[prevIndex1].name}
              className="side-image"
            />
          </div>

          <div className="card-item prev-item">
            <img
              src={this.officials[prevIndex2].img}
              alt={this.officials[prevIndex2].name}
              className="side-image"
            />
          </div>

          <div className="card-item">
            <img
              src={this.officials[index].img}
              alt={this.officials[index].name}
            />
            <h3 className="official-name">{this.officials[index].name}</h3>
            <p className="official-position">
              {this.officials[index].position}
            </p>
          </div>

          <div className="card-item next-item">
            <img
              src={this.officials[nextIndex1].img}
              alt={this.officials[nextIndex1].name}
              className="side-image"
            />
          </div>

          <div className="card-item next-item">
            <img
              src={this.officials[nextIndex2].img}
              alt={this.officials[nextIndex2].name}
              className="side-image"
            />
          </div>

          <button className="carousel-btn next" onClick={this.nextSlide}>
            <img src={rightarrow} alt="Next" />
          </button>
        </div>
      </div>
    );
  }
}

export default Officials;
