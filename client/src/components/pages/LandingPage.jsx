import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ImageCarousel from "../ImageCarousel.jsx";
import Header from "../Header";
import "./stylePages.css";

function LandingPage() {
  const [products, setProducts] = useState([]);

  // Refs for carousels
  const featuredScrollRef = useRef(null);
  const sofasScrollRef = useRef(null);
  const tablesScrollRef = useRef(null);
  const shelvesScrollRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/productsR")
      .then((response) => {
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const featuredProducts = products.slice(0, 7);
  const sofaProducts = products.filter(
    (product) => product.prodType && product.prodType.toLowerCase() === "sofa"
  );
  const tableProducts = products.filter(
    (product) => product.prodType && product.prodType.toLowerCase() === "table"
  );
  const shelvesProducts = products.filter(
    (product) =>
      product.prodType &&
      (product.prodType.toLowerCase() === "shelf" ||
        product.prodType.toLowerCase() === "shelves")
  );

  const scroll = (ref, distance) => {
    if (ref.current) {
      ref.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Header />
      <ImageCarousel />
      <div className="container mt-5">
        {/* Featured Products Section */}
        <h2>
          <Link to="/products" className="header-link">
            Featured Products
          </Link>
        </h2>
        <div className="carousel-container">
          <button
            onClick={() => scroll(featuredScrollRef, -300)}
            className="carousel-button"
          >
            {"<"}
          </button>
          <div className="horizontal-scroll-container" ref={featuredScrollRef}>
            {featuredProducts.map((product) => (
              <Link
                key={product.prodId}
                to="/products"
                className="product-link"
              >
                <div className="card h-100 product-card">
                  {product.prodImage ? (
                    <img
                      src={product.prodImage}
                      alt={product.name}
                      className="card-img-top product-img"
                    />
                  ) : (
                    <div className="card-img-top no-img d-flex justify-content-center align-items-center">
                      <span style={{ color: "#fff", fontSize: "1.5rem" }}>
                        No Image
                      </span>
                    </div>
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">
                      ₱{Number(product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <button
            onClick={() => scroll(featuredScrollRef, 300)}
            className="carousel-button carousel-button-right"
          >
            {">"}
          </button>
        </div>

        {/* Sofas Section */}
        {sofaProducts.length > 0 && (
          <div className="mt-5">
            <h2>
              <Link to="/products" className="header-link">
                Sofas
              </Link>
            </h2>
            <div className="carousel-container">
              <button
                onClick={() => scroll(sofasScrollRef, -300)}
                className="carousel-button"
              >
                {"<"}
              </button>
              <div className="horizontal-scroll-container" ref={sofasScrollRef}>
                {sofaProducts.map((product) => (
                  <Link
                    key={product.prodId}
                    to="/products"
                    className="product-link"
                  >
                    <div className="card h-100 product-card">
                      {product.prodImage ? (
                        <img
                          src={product.prodImage}
                          alt={product.name}
                          className="card-img-top product-img"
                        />
                      ) : (
                        <div className="card-img-top no-img d-flex justify-content-center align-items-center">
                          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => scroll(sofasScrollRef, 300)}
                className="carousel-button carousel-button-right"
              >
                {">"}
              </button>
            </div>
          </div>
        )}

        {/* Tables Section */}
        {tableProducts.length > 0 && (
          <div className="mt-5">
            <h2>
              <Link to="/products" className="header-link">
                Tables
              </Link>
            </h2>
            <div className="carousel-container">
              <button
                onClick={() => scroll(tablesScrollRef, -300)}
                className="carousel-button"
              >
                {"<"}
              </button>
              <div
                className="horizontal-scroll-container"
                ref={tablesScrollRef}
              >
                {tableProducts.map((product) => (
                  <Link
                    key={product.prodId}
                    to="/products"
                    className="product-link"
                  >
                    <div className="card h-100 product-card">
                      {product.prodImage ? (
                        <img
                          src={product.prodImage}
                          alt={product.name}
                          className="card-img-top product-img"
                        />
                      ) : (
                        <div className="card-img-top no-img d-flex justify-content-center align-items-center">
                          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => scroll(tablesScrollRef, 300)}
                className="carousel-button carousel-button-right"
              >
                {">"}
              </button>
            </div>
          </div>
        )}

        {/* Shelves Section */}
        {shelvesProducts.length > 0 && (
          <div className="mt-5">
            <h2>
              <Link to="/products" className="header-link">
                Shelves
              </Link>
            </h2>
            <div className="carousel-container">
              <button
                onClick={() => scroll(shelvesScrollRef, -300)}
                className="carousel-button"
              >
                {"<"}
              </button>
              <div
                className="horizontal-scroll-container"
                ref={shelvesScrollRef}
              >
                {shelvesProducts.map((product) => (
                  <Link
                    key={product.prodId}
                    to="/products"
                    className="product-link"
                  >
                    <div className="card h-100 product-card">
                      {product.prodImage ? (
                        <img
                          src={product.prodImage}
                          alt={product.name}
                          className="card-img-top product-img"
                        />
                      ) : (
                        <div className="card-img-top no-img d-flex justify-content-center align-items-center">
                          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">
                          ₱{Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button
                onClick={() => scroll(shelvesScrollRef, 300)}
                className="carousel-button carousel-button-right"
              >
                {">"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
