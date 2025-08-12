module.exports = (sequelize, DataTypes) => {
  const Products = sequelize.define(
    "Products",
    {
      prodId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stockQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prodImage: {
        type: DataTypes.BLOB("long"),
        allowNull: true,
      },
      prodType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  Products.associate = function (models) {
    Products.belongsToMany(models.Orders, {
      through: models.OrderItems,
      foreignKey: "prodId",
      otherKey: "orderId",
      as: "orders",
    });
  };

  return Products;
};
