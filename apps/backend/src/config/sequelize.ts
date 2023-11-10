import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

process.env.NODE_ENV ||= 'development';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

sequelize
  .authenticate()
  .then(() => console.info('Connected to PostgreSQL'))
  .catch(err => {
    console.error('PostgreSQL connection error:');
    console.debug(err);
  });

export default sequelize;
