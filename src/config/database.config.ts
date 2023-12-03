import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: process.env.DB_PORT || 5433,
  schema: process.env.DB_SCHEMA || 'techmotive',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
}));
