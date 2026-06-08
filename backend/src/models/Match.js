import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Match = sequelize.define(
  'Match',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    hostId: { type: DataTypes.INTEGER, allowNull: false },
    futsalId: { type: DataTypes.INTEGER, allowNull: false },
    format: { type: DataTypes.ENUM('5v5', '6v6', '7v7'), defaultValue: '5v5' },
    type: { type: DataTypes.ENUM('Casual', 'Competitive', 'Event'), defaultValue: 'Casual' },
    skill: { type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'), defaultValue: 'Intermediate' },
    date: { type: DataTypes.STRING, allowNull: false },  // YYYY-MM-DD
    time: { type: DataTypes.STRING, allowNull: false },  // HH:mm
    capacity: { type: DataTypes.INTEGER, defaultValue: 10 },
    pricePerHead: { type: DataTypes.INTEGER, defaultValue: 0 },
    requiresApproval: { type: DataTypes.BOOLEAN, defaultValue: true },
    status: { type: DataTypes.ENUM('open', 'full', 'live', 'completed', 'cancelled'), defaultValue: 'open' },
    scoreHome: { type: DataTypes.INTEGER, defaultValue: 0 },
    scoreAway: { type: DataTypes.INTEGER, defaultValue: 0 },
    clock: { type: DataTypes.INTEGER, defaultValue: 0 },     // seconds
    events: { type: DataTypes.JSON, defaultValue: [] },      // [{minute,team,type,note}]
  },
  { tableName: 'matches' }
);

export default Match;
