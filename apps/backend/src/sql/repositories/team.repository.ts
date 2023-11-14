import Team from '../models/team';
import TeamMembership from '../models/team-membership';
import User from '../models/user';

class TeamRepository {
  static async createTeam(
    userId: number,
    teamName: string,
    country: string | null,
    minAvailability: number | null
  ): Promise<Team> {
    try {
      const team: Team = await Team.create({
        team_name: teamName,
        country: country,
        min_availability: minAvailability,
      });

      await TeamMembership.create({ userId: userId, teamId: team.id });

      return team;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async getTeamMembers(teamId: number): Promise<Array<User>> {
    try {
      return await User.findAll({
        include: [
          {
            model: Team,
            where: { id: teamId },
          },
        ],
      });
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async addTeamMember(
    userId: number,
    teamId: number
  ): Promise<TeamMembership> {
    try {
      return await TeamMembership.create({ userid: userId, teamid: teamId });
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async removeTeamMember(
    userId: number,
    teamId: number,
  ): Promise<boolean> {
    try {
      return await TeamMembership.destroy({where: {UserId: userId, TeamId: teamId}}) === 1;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async getTeamsOfUser(userId: number): Promise<Array<Team>> {
    try {
      return await Team.findAll({
        include: [
          {
            model: User,
            where: { id: userId },
          },
        ],
      });
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }
}

export default TeamRepository;
