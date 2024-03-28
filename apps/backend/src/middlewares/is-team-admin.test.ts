import { describe, expect, jest, test } from '@jest/globals';
import TeamMembership from '../sql/models/team-membership';
import isTeamAdmin from './is-team-admin';

describe('isTeamAdmin', () => {
  const userId = 1;
  const teamId = 2;

  test('return true if member is found and is team admin', async () => {
    const findOneMock = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .fn<() => Promise<any>>()
      .mockResolvedValue({ UserId: userId, TeamId: teamId, is_team_admin: true });

    jest.spyOn(TeamMembership, 'findOne').mockImplementation(findOneMock);

    const result = await isTeamAdmin(userId, teamId);

    expect(result).toBe(true);
  });

  test('return false if member found but is not team admin', async () => {
    const findOneMock = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .fn<() => Promise<any>>()
      .mockResolvedValue({ UserId: userId, TeamId: teamId, is_team_admin: false });

    jest.spyOn(TeamMembership, 'findOne').mockImplementation(findOneMock);

    const result = await isTeamAdmin(userId, teamId);

    expect(result).toBe(false);
  });

  test('return false if member is not found', async () => {
    const findOneMock = jest
      .fn<() => Promise<TeamMembership | null>>()
      .mockResolvedValue(null);

    jest.spyOn(TeamMembership, 'findOne').mockImplementation(findOneMock);

    const result = await isTeamAdmin(userId, teamId);

    expect(result).toBe(false);
  });
});