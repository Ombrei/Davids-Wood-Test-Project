import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import { useCart } from "../CartContext";
import cartIcon from "../assets/addToCart.png";
import "./stylePages.css";

function Products() {
  const { addToCart, cart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState("");

  const categories = [
    "All",
    "Sofa",
    "Lighting",
    "Tables",
    "Bedframes",
    "Shelves",
  ];

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/productsR");
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((prod) => prod.prodType === selectedCategory);

  const handleAddToCart = (prod) => {
    const existing = cart.find((item) => item.prodId === prod.prodId);
    if (existing) {
      if (existing.quantity >= prod.stockQuantity) {
        alert("Cannot add more. Product stock limit reached.");
        return;
      }
    } else {
      if (prod.stockQuantity <= 0) {
        alert("This product is out of stock.");
        return;
      }
    }

    addToCart(prod);
    setNotification(`${prod.name} added to cart!`);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div>
      <Header />
      {/* Pop-up Notification */}
      {notification && <div className="notification-popup">{notification}</div>}
      <div className="container mt-5">
        <h1 className="prodHead">
          {selectedCategory === "All"
            ? "All Products"
            : `${selectedCategory} Products`}
        </h1>
        <div className="row">
          {/* Sidebar for clickable category filter */}
          <div className="col-md-3 mb-4">
            <div style={{ display: "flex", flexDirection: "column" }}>
              {categories.map((category) => (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 0",
                    fontWeight:
                      selectedCategory === category ? "bold" : "normal",
                    color:
                      selectedCategory === category ? "#8b4e2fbd" : "#212529",
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
          {/* Main content for product listing */}
          <div className="col-md-9">
            {filteredProducts.length === 0 ? (
              <p>No products available.</p>
            ) : (
              <div className="row">
                {filteredProducts.map((prod) => (
                  <div key={prod.prodId} className="col-md-4 mb-4">
                    <div
                      className="card product-card"
                      style={{ height: "400px", border: "1px solid #ccc" }}
                    >
                      {prod.prodImage ? (
                        <img
                          src={prod.prodImage}
                          alt={prod.name}
                          className="card-img-top"
                          style={{
                            height: "150px",
                            objectFit: "cover",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <div
                          className="card-img-top d-flex justify-content-center align-items-center"
                          style={{
                            backgroundColor: "#A0522D",
                            height: "150px",
                            width: "100%",
                          }}
                        >
                          <span style={{ color: "#fff", fontSize: "1.5rem" }}>
                            IMAGE
                          </span>
                        </div>
                      )}
                      <div
                        className="card-body"
                        style={{
                          backgroundColor: "#F5F5DC",
                          display: "flex",
                          flexDirection: "column",
                          padding: "10px",
                          height: "calc(100% - 150px)",
                        }}
                      >
                        <h5 className="card-title title-ellipsis">
                          {prod.name}
                        </h5>
                        <p
                          className="card-text"
                          style={{
                            fontWeight: "bold",
                            marginBottom: "0.5rem",
                          }}
                        >
                          ₱{prod.price}
                        </p>
                        <p className="card-text card-description">
                          {prod.description}
                        </p>
                        <p
                          className="card-text"
                          style={{ marginBottom: "0.5rem" }}
                        >
                          <strong>Type: </strong>
                          {prod.prodType}
                        </p>
                        {/* Display Stock Information */}
                        {prod.stockQuantity > 0 ? (
                          <p className="card-text">
                            <strong>Stock: </strong>
                            {prod.stockQuantity}
                          </p>
                        ) : (
                          <p
                            className="card-text"
                            style={{ color: "red", fontWeight: "bold" }}
                          >
                            Out of Stock
                          </p>
                        )}
                        <div
                          className="mt-auto d-flex justify-content-center flex-wrap gap-2"
                          style={{ width: "100%" }}
                        >
                          <button
                            className="add-to-cart-button"
                            disabled={prod.stockQuantity <= 0}
                            onClick={() => handleAddToCart(prod)}
                          >
                            <img
                              src={cartIcon}
                              alt="Add to Cart"
                              style={{ width: "20px", height: "20px" }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center py-4">
        &copy; 2025 All Rights Reserved.
      </footer>
    </div>
  );
}

export default Products;
