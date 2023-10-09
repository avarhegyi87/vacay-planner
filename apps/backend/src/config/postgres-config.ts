import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'admin',
  password: 'password',
  database: 'vacay-planner',
  host: 'localhost',
  port: 5432,
});

export default sequelize;
