const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Aircraft = sequelize.define('Aircraft', {
    aircraft_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    model: { type: DataTypes.STRING(100), allowNull: false },
    aircraft_type: { type: DataTypes.STRING(50), allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'active' },
  }, {
    tableName: 'aircrafts',
    timestamps: false,
  });
  return Aircraft;
};