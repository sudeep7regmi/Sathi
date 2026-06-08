import { sequelize } from '../config/db.js';
import User from './User.js';
import Futsal from './Futsal.js';
import Match from './Match.js';
import MatchPlayer from './MatchPlayer.js';
import Booking from './Booking.js';
import Message from './Message.js';
import Notification from './Notification.js';
import Tournament from './Tournament.js';

// ─── Associations ─────────────────────────────────────────────
// Owner → Futsals
User.hasMany(Futsal, { foreignKey: 'ownerId', as: 'futsals' });
Futsal.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Match → host (User) & futsal
User.hasMany(Match, { foreignKey: 'hostId', as: 'hostedMatches' });
Match.belongsTo(User, { foreignKey: 'hostId', as: 'host' });
Futsal.hasMany(Match, { foreignKey: 'futsalId', as: 'matches' });
Match.belongsTo(Futsal, { foreignKey: 'futsalId', as: 'futsal' });

// Match ↔ Players (many-to-many through MatchPlayer)
Match.belongsToMany(User, { through: MatchPlayer, foreignKey: 'matchId', otherKey: 'userId', as: 'roster' });
User.belongsToMany(Match, { through: MatchPlayer, foreignKey: 'userId', otherKey: 'matchId', as: 'matches' });
Match.hasMany(MatchPlayer, { foreignKey: 'matchId', as: 'memberships' });
MatchPlayer.belongsTo(Match, { foreignKey: 'matchId' });
MatchPlayer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Booking → futsal & user
Futsal.hasMany(Booking, { foreignKey: 'futsalId', as: 'bookings' });
Booking.belongsTo(Futsal, { foreignKey: 'futsalId', as: 'futsal' });
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Message → sender & match
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });

// Notification → user
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Tournament → futsal & organizer
Tournament.belongsTo(Futsal, { foreignKey: 'futsalId', as: 'futsal' });
Tournament.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

export {
  sequelize,
  User,
  Futsal,
  Match,
  MatchPlayer,
  Booking,
  Message,
  Notification,
  Tournament,
};
