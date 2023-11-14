import { GroupAttributes } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';
import User from './user';
import GroupMemberShip from './group-membership';

class Group extends Model implements GroupAttributes {
  declare id: number;
  declare teamid: number;
  declare group_name: string;
  declare min_availability: number | undefined;
}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    teamid: { type: DataTypes.INTEGER, allowNull: false },
    group_name: { type: DataTypes.STRING, allowNull: false, unique: true },
    min_availability: { type: DataTypes.DOUBLE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'groups',
    timestamps: true,
    indexes: [
      { name: 'group_name_index', fields: ['group_name'], unique: true },
    ],
  }
);

Group.belongsToMany(User, { through: GroupMemberShip, as: 'members' });
User.belongsToMany(Group, { through: GroupMemberShip, as: 'groups' });
Group.hasMany(GroupMemberShip);
GroupMemberShip.belongsTo(Group);
User.hasMany(GroupMemberShip);
GroupMemberShip.belongsTo(User);

export default Group;
