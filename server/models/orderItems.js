module.exports = (sequelize, DataTypes) => {
  const OrderItems = sequelize.define(
    "OrderItems",
    {
      orderItemId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "orderId",
        },
      },
      prodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "prodId",
        },
        onDelete: "CASCADE", 
        onUpdate: "CASCADE",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
    }
  );

  OrderItems.associate = function (models) {
    OrderItems.belongsTo(models.Orders, { foreignKey: "orderId", as: "order" });
    OrderItems.belongsTo(models.Products, {
      foreignKey: "prodId",
      as: "product",
    });
  };

  return OrderItems;
};
