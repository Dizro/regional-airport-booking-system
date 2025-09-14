const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    full_name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
    phone_number: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING(255), allowNull: false },
    user_role: { type: DataTypes.STRING(50), allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'users',
    timestamps: false,
  });
  return User;
};