import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Booking = sequelize.define(
  'Booking',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    futsalId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    court: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },       // YYYY-MM-DD
    startTime: { type: DataTypes.STRING, allowNull: false },  // HH:mm
    endTime: { type: DataTypes.STRING, allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'confirmed', 'declined', 'cancelled'), defaultValue: 'pending' },
  },
  {
    tableName: 'bookings',
    indexes: [{ unique: true, fields: ['futsalId', 'court', 'date', 'startTime'] }],
  }
);

export default Booking;
