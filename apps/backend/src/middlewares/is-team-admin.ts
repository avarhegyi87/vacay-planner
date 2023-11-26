import TeamMembership from '../sql/models/team-membership';

export async function isTeamAdmin(userId: number, teamId: number): Promise<boolean> {
  const member = await TeamMembership.findOne({
    where: { UserId: userId, TeamId: teamId },
  });

  if (member?.is_team_admin) return true;

  return false;
}

export default isTeamAdmin;
