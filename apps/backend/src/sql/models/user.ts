import { User } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';
import PostgresAccount from './account';
import PostgresToken from './token';

class PostgresUser extends Model implements User {
  declare id: number;
  declare username?: string | undefined;
  declare email: string;
  declare password?: string | undefined;
  declare is_admin?: boolean | undefined;
  declare is_active: boolean;
  declare is_verified: boolean;
}

PostgresUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: true },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [{ name: 'email_index', fields: ['email'], unique: true }],
  }
);

PostgresUser.hasMany(PostgresAccount, { foreignKey: 'userid', as: 'accounts' });
PostgresAccount.belongsTo(PostgresUser, { foreignKey: 'userid', as: 'user' });

PostgresUser.hasOne(PostgresToken, { foreignKey: 'userid', as: 'token' });
PostgresToken.belongsTo(PostgresUser, { foreignKey: 'userid', as: 'user' });

export default PostgresUser;
