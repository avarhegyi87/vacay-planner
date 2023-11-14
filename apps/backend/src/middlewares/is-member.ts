import TeamMembership from '../sql/models/team-membership';

export async function isMember(userId: number, teamId: number): Promise<boolean> {
  const member = await TeamMembership.findOne({
    where: { UserId: userId, TeamId: teamId },
  });
  return !!member;
}

export default isMember;
