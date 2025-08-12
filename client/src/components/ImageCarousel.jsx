import React from "react";
import Carousel from "react-bootstrap/Carousel";
import img1 from "./assets/a1.webp";
import img2 from "./assets/a2.avif";
import "./ImageCarousel.css";

function ImageCarousel() {
  return (
    <Carousel interval={3000} controls indicators>
      <Carousel.Item>
        <img className="d-block w-100" src={img1} alt="First slide" />
        <Carousel.Caption>
          <h1>Welcome to Kent's Wood!</h1>
          <h3>Where Quality Meets Craftsmanship</h3>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img className="d-block w-100" src={img2} alt="Second slide" />
        <Carousel.Caption>
          <h1>Welcome to Kent's Wood!</h1>
          <h3>Discover our exquisite range of wooden products.</h3>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default ImageCarousel;
