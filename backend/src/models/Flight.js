const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Flight = sequelize.define('Flight', {
    flight_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    flight_number: { type: DataTypes.STRING(10), allowNull: false },
    departure_airport_id: { type: DataTypes.INTEGER, allowNull: false },
    arrival_airport_id: { type: DataTypes.INTEGER, allowNull: false },
    scheduled_departure: { type: DataTypes.DATE, allowNull: false },
    scheduled_arrival: { type: DataTypes.DATE, allowNull: false },
    aircraft_id: { type: DataTypes.INTEGER, allowNull: true },
    flight_status: { type: DataTypes.STRING(50), allowNull: false },
    base_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    price_business_multiplier: { type: DataTypes.DECIMAL(4, 2), allowNull: false, defaultValue: 1.50 },
    price_first_class_multiplier: { type: DataTypes.DECIMAL(4, 2), allowNull: false, defaultValue: 2.50 },
  }, {
    tableName: 'flights',
    timestamps: false,
  });

  Flight.associate = (models) => {
    Flight.belongsTo(models.Airport, { as: 'departureAirport', foreignKey: 'departure_airport_id' });
    Flight.belongsTo(models.Airport, { as: 'arrivalAirport', foreignKey: 'arrival_airport_id' });
    Flight.belongsTo(models.Aircraft, { as: 'Aircraft', foreignKey: 'aircraft_id' });
    Flight.hasMany(models.Booking, { as: 'Bookings', foreignKey: 'flight_id' });
  };

  return Flight;
};