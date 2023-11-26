import { Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';

class GroupMemberShip extends Model {}

GroupMemberShip.init(
  {},
  {
    sequelize,
    modelName: 'GroupMembership',
    tableName: 'group_memberships',
    timestamps: false,
  },
);

export default GroupMemberShip;
