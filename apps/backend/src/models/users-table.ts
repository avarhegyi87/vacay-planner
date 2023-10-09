import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/postgres-config';
import { User } from '@vacay-planner/models';
import { AccountsTable } from './accounts-table';

export class UsersTable extends Model implements User {
  declare id: number;
  declare username?: string | undefined;
  declare email: string;
  declare created_at?: Date | undefined;
  declare is_admin?: boolean | undefined;
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

UsersTable.hasMany(AccountsTable, { foreignKey: 'userid' });
