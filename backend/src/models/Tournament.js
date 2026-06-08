import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Tournament = sequelize.define(
  'Tournament',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    futsalId: { type: DataTypes.INTEGER },
    organizerId: { type: DataTypes.INTEGER },
    format: { type: DataTypes.STRING, defaultValue: '5v5 Knockout' },
    maxTeams: { type: DataTypes.INTEGER, defaultValue: 16 },
    entryFee: { type: DataTypes.INTEGER, defaultValue: 0 },
    startDate: { type: DataTypes.STRING },
    endDate: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Registering', 'Live', 'Completed'), defaultValue: 'Registering' },
    // standings: [{team,played,won,drawn,lost,gd,points}], fixtures: [{home,away,score,status,kickoff}]
    standings: { type: DataTypes.JSON, defaultValue: [] },
    fixtures: { type: DataTypes.JSON, defaultValue: [] },
  },
  { tableName: 'tournaments' }
);

export default Tournament;
