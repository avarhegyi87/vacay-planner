import TeamMembership from '../sql/models/team-membership';

export async function isTeamAdmin(userId: number, teamId: number): Promise<boolean> {
  const member = await TeamMembership.findOne({
    where: { UserId: userId, TeamId: teamId },
  });

  return !!member && !!member.is_team_admin;
}

export default isTeamAdmin;
