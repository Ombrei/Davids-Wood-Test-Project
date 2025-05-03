module.exports = (sequelize, DataTypes) => {
    const CustomerInfo = sequelize.define(
        "CustomerInfo",
        {
            customerId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'userId',
                },
            },
            balance: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },{
        tableName: "customer_info",
        timestamps: true,
        }
    );
    
    return CustomerInfo;
    }