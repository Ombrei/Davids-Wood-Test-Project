import React from "react";
import Header from "../Header";
import "../pages/stylePages.css";

// members
import yuan from "../assets/yuan.jpg";
import kurt from "../assets/kurt.jpg";

const About = () => {
  return (
    <div>
      <Header />

      {/* Main About Content */}
      <div className="container about-container mt-5">
        <h1 className="text-center">ABOUT US</h1>
        <p className="about-text">
          About Kent’s Wood – Founded amid the challenges of the pandemic,
          Kent’s Wood rose with resilience, driven by a vision to bring warmth,
          comfort, and artistry into every home. What began as a humble workshop
          has grown into a trusted brand celebrated for its finely crafted
          wooden furniture — blending timeless design, durability, and
          sustainability.
          <br />
          <br />
          At Kent’s Wood, we believe that every home deserves furniture with
          soul. That’s why we use premium materials, sustainable practices, and
          expert craftsmanship to create pieces that are not only beautiful but
          built to last. From custom-built creations to timeless wooden
          essentials, every piece tells a story of dedication, detail, and
          design.
        </p>

        {/* Team Members Section */}
        <div className="team-row mt-4">
          <div className="team-col">
            <div className="member-container">
              <img
                src={yuan}
                alt="Yuan"
                className="member-img img-fluid rounded mb-2"
              />
              <h3>Yuan</h3>
              <p className="tip-email">TIP Email: qycpmagtangob@tip.edu.ph</p>
            </div>
          </div>
          <div className="team-col">
            <div className="member-container">
              <img
                src={kurt}
                alt="Kurt"
                className="member-img img-fluid rounded mb-2"
              />
              <h3>Kurt</h3>
              <p className="tip-email">TIP Email: qkshombre@tip.edu.ph</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        &copy; 2025 All Rights Reserved.
      </footer>
    </div>
  );
};

export default About;
