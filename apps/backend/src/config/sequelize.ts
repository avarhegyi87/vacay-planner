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

export default sequelize;
