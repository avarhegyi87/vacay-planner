import { DataTypes, Model } from 'sequelize';
import { Team } from '@vacay-planner/models';
import sequelize from '../../config/sequelize-config';
import PostgresUser from './user';
import PostgresGroup from './group';
import TeamMembership from './team-membership';

class PostgresTeam extends Model implements Team {
  declare id: number;
  declare country: string | undefined;
  declare team_name: string;
  declare min_availability: number | undefined;
}

PostgresTeam.init(
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

PostgresTeam.belongsToMany(PostgresUser, { through: TeamMembership });
PostgresUser.belongsToMany(PostgresTeam, { through: TeamMembership });
PostgresTeam.hasMany(TeamMembership);
TeamMembership.belongsTo(PostgresTeam);
PostgresUser.hasMany(TeamMembership);
TeamMembership.belongsTo(PostgresUser);

PostgresTeam.hasMany(PostgresGroup);
PostgresGroup.belongsTo(PostgresTeam);

export default PostgresTeam;
