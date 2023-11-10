import { Sequelize } from 'sequelize';

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
  .catch(() => console.error('PostgreSQL connection error'));

export default sequelize;
