'use strict';
module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define('products', {
    userId: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {});
  products.associate = function(models) {
    // associations can be defined here
  };
  return products;
};