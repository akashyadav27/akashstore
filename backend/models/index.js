const { sequelize } = require('../config/database');
const User = require('./user');
const Product = require('./product');
const Order = require('./order');

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Product, Order };