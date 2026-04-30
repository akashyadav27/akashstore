const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  }
);

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ MySQL Connected Successfully!');
      return;
    } catch (error) {
      retries -= 1;
      console.log(`⚠️ Connection failed. Retries left: ${retries}`);
      console.log('Error:', error.message);
      if (retries === 0) {
        console.error('❌ Database connection failed after all retries');
        process.exit(1);
      }
      // Wait 5 seconds before retrying
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

module.exports = { sequelize, connectDB };