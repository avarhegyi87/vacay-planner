import { Sequelize } from 'sequelize';
import keys from '../keys/keys';

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: keys.postgresUsername,
  password: keys.postgresPassword,
  database: keys.postgresDatabase,
  host: keys.postgresHost,
  port: parseInt(keys.postgresPort || '5432'),
});

sequelize
  .authenticate()
  .then(() => console.info('Connected to PostgreSQL'))
  .catch(() => console.error('PostgreSQL connection error'));

export default sequelize;
