/* eslint-disable @typescript-eslint/no-explicit-any */
import PostgresTeam from '../models/team';
import TeamMembership from '../models/team-membership';
import PostgresUser from '../models/user';

class TeamRepository {
  static async createTeam(
    userId: number,
    teamName: string,
    country: string | null,
    minAvailability: number | null,
  ): Promise<PostgresTeam> {
    try {
      const team: PostgresTeam = await PostgresTeam.create({
        team_name: teamName,
        country: country,
        min_availability: minAvailability,
      });

      await TeamMembership.create({ UserId: userId, TeamId: team.id, is_team_admin: true });

      return team;
    } catch (error: any) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  static async getTeamMembers(teamId: number): Promise<Array<PostgresUser>> {
    try {
      return await PostgresUser.findAll({
        include: [
          {
            model: PostgresTeam,
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
    teamId: number,
  ): Promise<TeamMembership> {
    try {
      return await TeamMembership.create({ UserId: userId, TeamId: teamId });
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

  static async getTeamsOfUser(userId: number): Promise<Array<PostgresTeam>> {
    try {
      return await PostgresTeam.findAll({
        include: [
          {
            model: PostgresUser,
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
