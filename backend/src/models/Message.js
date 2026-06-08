import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Message = sequelize.define(
  'Message',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thread: { type: DataTypes.STRING, allowNull: false },   // `match:<id>` or `dm:<a>_<b>`
    matchId: { type: DataTypes.INTEGER },
    senderId: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: 'messages', indexes: [{ fields: ['thread'] }] }
);

export default Message;
