import { DataTypes, Model, Sequelize } from 'sequelize';
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

class Session extends Model {
  declare sid: string;
  declare expires: Date;
  declare data: string;
}

Session.init(
  {
    sid: { type: DataTypes.STRING, primaryKey: true },
    expires: { type: DataTypes.DATE },
    data: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: 'Session',
    tableName: 'sessions',
    timestamps: true,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.info('Connected to PostgreSQL')
  })
  .catch(err => {
    console.error('PostgreSQL connection error:');
    console.debug(err);
  });

export default sequelize;
