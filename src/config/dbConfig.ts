import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  dbHost: process.env.POSTGRES_HOST,
  dbPort: process.env.POSTGRES_PORT,
  dbUser: process.env.POSTGRES_USER,
  dbPassword: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
}));
