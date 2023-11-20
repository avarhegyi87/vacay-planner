import { Group } from '@vacay-planner/models';
import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';
import PostgresUser from './user';
import GroupMemberShip from './group-membership';

class PostgresGroup extends Model implements Group {
  declare id: number;
  declare teamid: number;
  declare group_name: string;
  declare min_availability: number | undefined;
}

PostgresGroup.init(
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

PostgresGroup.belongsToMany(PostgresUser, { through: GroupMemberShip, as: 'members' });
PostgresUser.belongsToMany(PostgresGroup, { through: GroupMemberShip, as: 'groups' });
PostgresGroup.hasMany(GroupMemberShip);
GroupMemberShip.belongsTo(PostgresGroup);
PostgresUser.hasMany(GroupMemberShip);
GroupMemberShip.belongsTo(PostgresUser);

export default PostgresGroup;
