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
        type: DataTypes.DECIMAL(10, 2),
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
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  return Products;
};
