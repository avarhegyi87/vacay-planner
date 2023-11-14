import { DataTypes, Model } from 'sequelize';
import { TeamAttributes } from '@vacay-planner/models';
import sequelize from '../../config/sequelize-config';
import User from './user';
import Group from './group';
import TeamMembership from './team-membership';

class Team extends Model implements TeamAttributes {
  declare id: number;
  declare country: string | undefined;
  declare team_name: string;
  declare min_availability: number | undefined;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    country: { type: DataTypes.STRING(2), allowNull: true },
    team_name: { type: DataTypes.STRING, allowNull: false },
    min_availability: { type: DataTypes.DOUBLE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Team',
    tableName: 'teams',
    timestamps: true,
    indexes: [{ name: 'team_name_index', fields: ['team_name'], unique: true }],
  }
);

Team.belongsToMany(User, { through: TeamMembership });
User.belongsToMany(Team, { through: TeamMembership });
Team.hasMany(TeamMembership);
TeamMembership.belongsTo(Team);
User.hasMany(TeamMembership);
TeamMembership.belongsTo(User);

Team.hasMany(Group);
Group.belongsTo(Team);

export default Team;
