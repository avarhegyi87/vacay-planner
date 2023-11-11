import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/sequelize-config';

class TeamMembership extends Model {}

TeamMembership.init(
  {
    is_team_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'TeamMembership',
    tableName: 'team_memberships',
    timestamps: false,
  }
);

export default TeamMembership;
