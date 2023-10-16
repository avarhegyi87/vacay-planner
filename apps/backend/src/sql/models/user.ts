import { UserAttributes } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize';
import Account from './account';

class User extends Model implements UserAttributes {
  declare id: number;
  declare username?: string | undefined;
  declare email: string;
  declare created_at?: Date | undefined;
  declare is_admin?: boolean | undefined;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    username: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
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
  }
);

User.hasMany(Account, { foreignKey: 'userid', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userid', as: 'user' });

export default User;