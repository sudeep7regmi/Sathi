import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Notification = sequelize.define(
  'Notification',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('request', 'approved', 'live', 'booking', 'event', 'system'), defaultValue: 'system' },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.STRING, defaultValue: '' },
    link: { type: DataTypes.STRING, defaultValue: '' },
    read: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: 'notifications', indexes: [{ fields: ['userId'] }] }
);

export default Notification;
