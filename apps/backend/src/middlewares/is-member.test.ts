import { describe, expect, jest, test } from '@jest/globals';
import TeamMembership from '../sql/models/team-membership';
import isMember from './is-member';

describe('isMember', () => {
  const userId = 1;
  const teamId = 2;

  test('return true if user is a member of the team', async () => {
    // Mocking the result of the findOne method
    const findOneMock = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .fn<() => Promise<any>>()
      .mockResolvedValue({
        UserId: userId,
        TeamId: teamId,
      });
    jest.spyOn(TeamMembership, 'findOne').mockImplementation(findOneMock);

    // Act
    const result = await isMember(userId, teamId);

    // Assert
    expect(result).toBe(true);
  });

  test('return false if user is not a member of the team', async () => {
    // Mocking the result of the findOne method
    const findOneMock = jest
      .fn<() => Promise<TeamMembership | null>>()
      .mockResolvedValue(null);

    jest.spyOn(TeamMembership, 'findOne').mockImplementation(findOneMock);

    // Act
    const result = await isMember(userId, teamId);

    // Assert
    expect(result).toBe(false);
  });
});
