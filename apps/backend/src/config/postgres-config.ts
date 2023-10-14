import { Account, Provider, User } from '@vacay-planner/models';
import { DataTypes, Model, Sequelize } from 'sequelize';
import keys from '../keys/keys';

const sequelize = new Sequelize({
  dialect: 'postgres',
  username: keys.postgresUsername,
  password: keys.postgresPassword,
  database: keys.postgresDatabase,
  host: keys.postgresHost,
  port: parseInt(keys.postgresPort || '5432'),
});

export class UsersTable extends Model implements User {
  declare id: number;
  declare username?: string | undefined;
  declare email: string;
  declare created_at?: Date | undefined;
  declare is_admin?: boolean | undefined;
}

export class AccountsTable extends Model implements Account {
  declare id: number;
  declare userid: number;
  declare provider: Provider;
  declare accountid: string | undefined;
  declare expiration: Date | undefined;
}

UsersTable.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true,
    },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: 'User' }
);

AccountsTable.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    accountid: { type: DataTypes.STRING, allowNull: true },
    expiration: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Account' }
);

UsersTable.hasMany(AccountsTable, { foreignKey: 'userid' });

export default sequelize;
