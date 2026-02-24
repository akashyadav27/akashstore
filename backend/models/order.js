const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderItems: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
  },
  isDelivered: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deliveredAt: {
    type: DataTypes.DATE,
  },
}, {
  timestamps: true,
});

// One user can have many orders
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;