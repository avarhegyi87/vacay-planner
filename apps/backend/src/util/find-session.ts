import { redisClient } from '..';

export async function  findSessionKey(userId: number): Promise<string | null> {
  const prefix: string = 'vacay-planner';
  const sessionsWithPrefix = await redisClient.keys(`${prefix}*`);

  for (const sessionKey of sessionsWithPrefix) {
    const sessionData = await redisClient.get(sessionKey);
    const session = sessionData ? JSON.parse(sessionData) : null;

    if (session.passport?.user?.id === userId) return sessionKey;
  }

  return null;
}