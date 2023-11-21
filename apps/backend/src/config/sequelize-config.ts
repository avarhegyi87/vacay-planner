import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

process.env.NODE_ENV ||= 'development';
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL ?? process.env.POSTGRES_URI ?? 'postgres@localhost:5432', {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.info('Connected to PostgreSQL');
    require('../sql/models');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err);
  });

export default sequelize;
