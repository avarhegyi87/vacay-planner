import { Token } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';

class PostgresToken extends Model implements Token {
  declare id: number;
  declare userid: number;
  declare token: string;
  declare expire_at: Date;
}

PostgresToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    userid: { type: DataTypes.INTEGER, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    expire_at: { type: DataTypes.DATE },
  },
  { sequelize, modelName: 'Token', tableName: 'tokens', timestamps: true }
);

export default PostgresToken;
