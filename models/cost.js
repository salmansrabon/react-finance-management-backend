const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust the path as needed


class Cost extends Model {}

Cost.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    itemName: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    purchaseDate: { type: DataTypes.DATE, allowNull: false },
    month: { type: DataTypes.STRING, allowNull: false },
    remarks: { type: DataTypes.STRING },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'users',
        key: '_id',
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Cost',
    tableName: 'costs',
  }
);

module.exports = Cost;
