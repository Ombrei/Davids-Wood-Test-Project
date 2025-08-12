import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../Header";
import "./style.css";

function ProductManagement() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    prodImage: null,
    prodType: "", 
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const resizeImage = (file, maxWidth = 300, maxHeight = 300) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = (err) => reject(err);
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = (err) => reject(err);
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });
              resolve(resizedFile);
            },
            file.type,
            1 
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;
    if (name === "prodImage" && files && files[0]) {
      try {
        const resizedFile = await resizeImage(files[0]);
        setFormData({ ...formData, prodImage: resizedFile });
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("stockQuantity", formData.stockQuantity);
    fd.append("prodType", formData.prodType);
    if (formData.prodImage) {
      fd.append("prodImage", formData.prodImage);
    }
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:3000/productsR/${editingProduct.prodId}`,
          fd,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setEditingProduct(null);
      } else {
        await axios.post("http://localhost:3000/productsR", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setFormData({
        name: "",
        description: "",
        price: "",
        stockQuantity: "",
        prodImage: null,
        prodType: "",
      });
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      prodImage: null,
      prodType: product.prodType || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/productsR/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <h1>Product Management</h1>
        {/* Product Form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="description" className="form-label">
                Description:
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="price" className="form-label">
                Price:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="stockQuantity" className="form-label">
                Stock Quantity:
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                className="form-control"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row">
            {/* Product Type */}
            <div className="col-6 mb-3">
              <label htmlFor="prodType" className="form-label">
                Product Type:
              </label>
              <select
                id="prodType"
                name="prodType"
                className="form-control"
                value={formData.prodType}
                onChange={handleChange}
                required
              >
                <option value="">Select a product type</option>
                <option value="Sofa">Sofa</option>
                <option value="Lighting">Lighting</option>
                <option value="Tables">Tables</option>
                <option value="Bedframes">Bedframes</option>
                <option value="Shelves">Shelves</option>
              </select>
            </div>
            {/* Product Image */}
            <div className="col-6 mb-3">
              <label htmlFor="prodImage" className="form-label">
                Product Image:
              </label>
              <input
                type="file"
                id="prodImage"
                name="prodImage"
                className="form-control"
                onChange={handleChange}
                accept="image/*"
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn"
            style={{
              backgroundColor: "#8b4e2f",
              borderColor: "#8b4e2f",
              color: "#fff",
            }}
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  stockQuantity: "",
                  prodImage: null,
                  prodType: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
        <hr />
        {/* Products List */}
        <h2>Products List</h2>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          <div className="row">
            {products.map((prod) => (
              <div key={prod.prodId} className="col-md-3 mb-4">
                <div className="card" style={{ height: "400px" }}>
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
                    {}
                    <p className="card-text" style={{ marginBottom: "0.5rem" }}>
                      <strong>Stock: </strong>
                      {prod.stockQuantity}
                    </p>
                    <div
                      className="mt-auto button-container d-flex justify-content-center flex-wrap gap-2"
                      style={{ width: "100%" }}
                    >
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleEdit(prod)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(prod.prodId)}
                      >
                        Delete
                      </button>
                    </div>
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

export default ProductManagement;
