import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Join row: which players are in a match, and pending join-requests.
const MatchPlayer = sequelize.define(
  'MatchPlayer',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    matchId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'accepted', 'declined'), defaultValue: 'pending' },
  },
  {
    tableName: 'match_players',
    indexes: [{ unique: true, fields: ['matchId', 'userId'] }],
  }
);

export default MatchPlayer;
