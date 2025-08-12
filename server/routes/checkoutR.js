const express = require("express");
const router = express.Router();

const { Orders, OrderItems, Products, sequelize } = require("../models");

router.post("/", async (req, res) => {
  const { userId, totalAmount, orderItems, address, phone } = req.body;

  if (
    !userId ||
    totalAmount === undefined ||
    !orderItems ||
    orderItems.length === 0 ||
    !address ||
    !phone
  ) {
    return res
      .status(400)
      .json({ message: "Missing required order information." });
  }

  const orderDate = new Date();

  const t = await sequelize.transaction();
  try {
    const newOrder = await Orders.create(
      { userId, orderDate, totalAmount: Number(totalAmount), address, phone },
      { transaction: t }
    );

    for (const item of orderItems) {
      await OrderItems.create(
        {
          orderId: newOrder.orderId,
          prodId: item.prodId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
        { transaction: t }
      );

      await Products.update(
        {
          stockQuantity: sequelize.literal(`stockQuantity - ${item.quantity}`),
        },
        { where: { prodId: item.prodId }, transaction: t }
      );
    }

    await t.commit();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    await t.rollback();
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
});

module.exports = router;
