const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Products } = require("../models");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    let products = await Products.findAll();
    products = products.map((prod) => {
      if (prod.prodImage) {
        prod = prod.toJSON();
        prod.prodImage =
          "data:image/jpeg;base64," + prod.prodImage.toString("base64");
      }
      return prod;
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", upload.single("prodImage"), async (req, res) => {
  try {
    const { name, description, price, stockQuantity, prodType } = req.body;

    let prodImage = null;
    if (req.file) {
      prodImage = req.file.buffer;
    }

    const newProduct = await Products.create({
      name,
      description,
      price,
      stockQuantity,
      prodType, 
      prodImage, 
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

router.put("/:prodId", upload.single("prodImage"), async (req, res) => {
  try {
    const { prodId } = req.params;
    const { name, description, price, stockQuantity, prodType } = req.body;

    let updateData = { name, description, price, stockQuantity, prodType };
    if (req.file) {
      updateData.prodImage = req.file.buffer;
    }

    const [updatedRowsCount, updatedRows] = await Products.update(updateData, {
      where: { prodId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json(updatedRows[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product." });
  }
});

router.delete("/:prodId", async (req, res) => {
  try {
    const { prodId } = req.params;
    const deletedCount = await Products.destroy({ where: { prodId } });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product." });
  }
});

module.exports = router;
