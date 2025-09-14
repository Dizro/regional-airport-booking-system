const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    booking_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_reference: { type: DataTypes.STRING(8), unique: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    cashier_id: { type: DataTypes.INTEGER, allowNull: false },
    flight_id: { type: DataTypes.INTEGER, allowNull: false },
    total_cost: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    booking_status: { type: DataTypes.STRING(50), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'bookings',
    timestamps: false,
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { as: 'customer', foreignKey: 'user_id' });
    Booking.belongsTo(models.User, { as: 'cashier', foreignKey: 'cashier_id' });
    Booking.belongsTo(models.Flight, { as: 'Flight', foreignKey: 'flight_id' });
    Booking.hasMany(models.Ticket, { as: 'Tickets', foreignKey: 'booking_id' });
  };

  return Booking;
};