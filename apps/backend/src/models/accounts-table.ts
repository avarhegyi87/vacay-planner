import { Account, ProviderType } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/postgres-config';
import { UsersTable } from './users-table';

export class AccountsTable extends Model implements Account {
  declare userid: number;
  declare provider: ProviderType;
  declare accountid: string | undefined;
  declare expiration: Date | undefined;
}

AccountsTable.init(
  {
    userid: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    provider: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
    expiration: { type: DataTypes.DATE, allowNull: true },
  },
  { sequelize, modelName: 'Token' }
);

AccountsTable.belongsTo(UsersTable, { foreignKey: 'userid' });
