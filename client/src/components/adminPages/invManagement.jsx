import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "../Header";
import "./style.css";

function InvManagement() {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newStock, setNewStock] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filterScrollRef = useRef(null);

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

  const uniqueCategories = Array.from(
    new Set(products.map((prod) => prod.prodType))
  );
  const categories = ["All", ...uniqueCategories];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (prod) =>
            prod.prodType &&
            prod.prodType.toLowerCase() === selectedCategory.toLowerCase()
        );

  const scrollFilter = (distance) => {
    if (filterScrollRef.current) {
      filterScrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  const handleEditStock = (product) => {
    setEditingProductId(product.prodId);
    setNewStock(product.stockQuantity);
  };

  const handleStockUpdate = async (prodId) => {
    try {
      await axios.put(`http://localhost:3000/productsR/${prodId}`, {
        stockQuantity: Number(newStock),
      });
      setEditingProductId(null);
      setNewStock("");
      fetchProducts();
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
    setNewStock("");
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Inventory Management</h1>

        {/* Filter Bar */}
        <div
          className="filter-carousel-container"
          style={{ position: "relative", marginBottom: "20px" }}
        >
          <button
            className="carousel-button"
            onClick={() => scrollFilter(-200)}
          >
            {"<"}
          </button>
          <div
            className="horizontal-scroll-container"
            ref={filterScrollRef}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "10px",
              padding: "10px 40px",
            }}
          >
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`filter-item btn btn-outline-secondary ${
                  selectedCategory === cat ? "active-filter" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button
            className="carousel-button carousel-button-right"
            onClick={() => scrollFilter(200)}
          >
            {">"}
          </button>
        </div>

        {/* Products List (filtered) */}
        {filteredProducts.length === 0 ? (
          <p>No products available or matching the selected filter.</p>
        ) : (
          <div className="row">
            {filteredProducts.map((prod) => (
              <div key={prod.prodId} className="col-md-3 mb-4">
                <div
                  className="card"
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
                    <h5 className="card-title title-ellipsis">{prod.name}</h5>
                    <p
                      className="card-text"
                      style={{ fontWeight: "bold", marginBottom: "0.5rem" }}
                    >
                      ₱{prod.price}
                    </p>
                    <p className="card-text card-description">
                      {prod.description}
                    </p>
                    <p className="card-text" style={{ marginBottom: "0.5rem" }}>
                      <strong>Type: </strong>
                      {prod.prodType}
                    </p>
                    <p className="card-text" style={{ marginBottom: "0.5rem" }}>
                      <strong>Stock: </strong>
                      {prod.stockQuantity}
                    </p>
                    {editingProductId === prod.prodId ? (
                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          className="form-control"
                          style={{ maxWidth: "100px", marginRight: "5px" }}
                        />
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStockUpdate(prod.prodId)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-sm btn-secondary ms-2"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-sm btn-warning mt-auto"
                        onClick={() => handleEditStock(prod)}
                      >
                        Edit Stock
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <footer className="text-center py-4">
          &copy; 2025 All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

export default InvManagement;
