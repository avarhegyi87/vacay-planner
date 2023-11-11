import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';

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

export default Session;
