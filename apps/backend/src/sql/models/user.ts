import { UserAttributes } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';
import PostgresAccount from './account';

class PostgresUser extends Model implements UserAttributes {
  declare id: number;
  declare username?: string | undefined;
  declare email: string;
  declare password?: string | undefined;
  declare is_admin?: boolean | undefined;
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
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

export default PostgresUser;
