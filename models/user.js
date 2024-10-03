const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db'); // Adjust the path as needed
const { v4: uuidv4 } = require('uuid'); // Import uuidv4


class User extends Model {
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Use uuidv4 function
      primaryKey: true,
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: true },
    gender: { type: DataTypes.STRING, allowNull: false },
    termsAccepted: { type: DataTypes.BOOLEAN, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    profileImage: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      afterCreate: (user, options) => {
        console.log('Generated _id:', user._id);
      },
    },
  }
);

module.exports = User;
