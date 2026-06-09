import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// Update the import path to target the compiler's actual compiled client folder:
import { PrismaClient } from '../generated/client'; 

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export { prisma };