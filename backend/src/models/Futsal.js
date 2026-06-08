import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Futsal = sequelize.define(
  'Futsal',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    area: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, defaultValue: 'Pokhara' },
    pricePerHour: { type: DataTypes.INTEGER, allowNull: false },
    openHours: { type: DataTypes.STRING, defaultValue: '6 AM – 10 PM' },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    // Embedded list of courts: [{ name, size, surface, status }]
    courts: { type: DataTypes.JSON, defaultValue: [] },
    photos: { type: DataTypes.JSON, defaultValue: [] },
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('Active', 'Pending', 'Rejected'), defaultValue: 'Pending' },
  },
  { tableName: 'futsals' }
);

export default Futsal;
