import { redisClient } from '..';

export async function updateSessionWithVerified(
  sessionId: string,
  verified: boolean,
) {
  try {
    const sessionData = await redisClient.get(sessionId);

    if (!sessionData) {
      console.error(`Session ${sessionId} not found in Redis`);
      return;
    }

    const parsedData = JSON.parse(sessionData);
    parsedData.is_verified = verified;
    await redisClient.set(sessionId, JSON.stringify(parsedData));
    console.log(`Session ${sessionId} updated successfully`);
  } catch (error) {
    console.error('Error updating session:', error);
  }
}
