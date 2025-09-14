const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    ticket_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    booking_id: { type: DataTypes.INTEGER, allowNull: false },
    passenger_full_name: { type: DataTypes.STRING(255), allowNull: false },
    passenger_document_number: { type: DataTypes.STRING(50), allowNull: false },
    seat_number: { type: DataTypes.STRING(4), allowNull: true },
    service_class: { type: DataTypes.STRING(50), allowNull: false },
    final_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, {
    tableName: 'tickets',
    timestamps: false,
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.Booking, { as: 'Booking', foreignKey: 'booking_id' });
  };

  return Ticket;
};