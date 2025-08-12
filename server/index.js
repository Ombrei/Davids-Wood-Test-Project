const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

const db = require("./models");

// Existing routers
const postUsers = require("./routes/usersR");
app.use("/usersR", postUsers);

const productRoutes = require("./routes/productsR");
app.use("/productsR", productRoutes);

// Add the checkout routes
const checkoutRoutes = require("./routes/checkoutR");
app.use("/checkout", checkoutRoutes);

const orderRoutes = require("./routes/ordersR");
app.use("/ordersR", orderRoutes);

// Sync the database and then start the server.
db.sequelize
  .sync({ alter: true }) 
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
    console.log("Database synced successfully!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
