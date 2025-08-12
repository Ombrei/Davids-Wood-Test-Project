const express = require("express");
const router = express.Router();
const { Orders, OrderItems, Products, Users } = require("../models"); 

router.get("/", async (req, res) => {
  const { userId } = req.query;
  let where = {};
  if (userId) {
    where.userId = userId;
  }

  try {
    const orders = await Orders.findAll({
      where,
      attributes: [
        "orderId",
        "userId",
        "orderDate",
        "totalAmount",
        "address",
        "phone",
      ],
      include: [
        {
          model: Users,
          as: "user", 
          attributes: ["username"], 
        },
        {
          model: OrderItems,
          as: "orderItems", 
          include: [
            {
              model: Products,
              as: "product", 
            },
          ],
        },
      ],
      order: [["orderDate", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving orders",
      error: error.message,
    });
  }
});

module.exports = router;
