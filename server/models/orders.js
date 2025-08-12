module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define(
    "Orders",
    {
      orderId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // New fields for checkout details:
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    }
  );

  Orders.associate = function (models) {
    // Each order has many order items.
    Orders.hasMany(models.OrderItems, {
      foreignKey: "orderId",
      as: "orderItems",
    });
    // Optional: if you want to include the products (many-to-many) via OrderItems.
    Orders.belongsToMany(models.Products, {
      through: models.OrderItems,
      foreignKey: "orderId",
      otherKey: "prodId",
      as: "products",
    });
    // Establish the Order -> User association.
    Orders.belongsTo(models.Users, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Orders;
};
