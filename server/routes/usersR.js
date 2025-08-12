const express = require("express");
const router = express.Router();
const { Users } = require("../models");

router.get("/", async (req, res) => {
  try {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
  } catch (err) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    const newUser = await Users.create(user);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ where: { email: email.trim() } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.password.trim() !== password.trim()) {
      console.log("Stored password:", JSON.stringify(user.password));
      console.log("Submitted password:", JSON.stringify(password));
      return res.status(401).json({ error: "Invalid password" });
    }
    const userData = user.toJSON();
    res.json(userData);
  } catch (err) {
    console.error("Error in sign in route:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Users.update(req.body, { where: { userId: id } });
    const updatedUser = await Users.findOne({ where: { userId: id } });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
