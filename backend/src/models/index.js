const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Aircraft = require('./Aircraft')(sequelize, DataTypes);
db.Airport = require('./Airport')(sequelize, DataTypes);
db.Booking = require('./Booking')(sequelize, DataTypes);
db.Flight = require('./Flight')(sequelize, DataTypes);
db.Ticket = require('./Ticket')(sequelize, DataTypes);
db.User = require('./User')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;