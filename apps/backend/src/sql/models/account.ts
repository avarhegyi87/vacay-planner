import { AccountAttributes, Provider } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';

class Account extends Model implements AccountAttributes {
  declare id: number;
  declare userid: number;
  declare provider: Provider;
  declare accountid: string | undefined;
  declare expiration: Date | undefined;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    provider: { type: DataTypes.STRING, allowNull: false },
    accountid: { type: DataTypes.STRING, allowNull: true },
    expiration: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { isDate: true },
    },
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
    modelName: 'Account',
    tableName: 'accounts',
    timestamps: true,
    indexes: [
      { name: 'userid_index', fields: ['userid'] },
      {
        name: 'userid_provider_index',
        fields: ['userid', 'provider'],
        unique: true,
      },
      { name: 'accountid_index', fields: ['accountid'], unique: true },
    ],
  }
);

export default Account;
