const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Airport = sequelize.define('Airport', {
    airport_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    airport_name: { type: DataTypes.STRING(255), allowNull: false },
    airport_code: { type: DataTypes.STRING(3), unique: true, allowNull: false },
  }, {
    tableName: 'airports',
    timestamps: false,
  });
  return Airport;
};