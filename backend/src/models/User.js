import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db.js';

const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, defaultValue: '' },
    role: { type: DataTypes.ENUM('player', 'owner', 'admin'), defaultValue: 'player' },
    city: { type: DataTypes.STRING, defaultValue: 'Pokhara' },

    // Player profile
    position: { type: DataTypes.STRING, defaultValue: 'Midfielder' },
    skill: { type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'), defaultValue: 'Intermediate' },
    rating: { type: DataTypes.FLOAT, defaultValue: 0 },
    matchesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
    avatarHue: { type: DataTypes.INTEGER, defaultValue: 152 },

    // Owner / account
    verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.ENUM('Active', 'Pending', 'Suspended'), defaultValue: 'Active' },
  },
  {
    tableName: 'users',
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: {} } },
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
      },
    },
  }
);

User.prototype.matchPassword = function (entered) {
  return bcrypt.compare(entered, this.password);
};

export default User;
