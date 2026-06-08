import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'sathi',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    define: { underscored: false },
  }
);

export async function connectDB() {
  await sequelize.authenticate();
  console.log(`✓ MySQL connected: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
}
