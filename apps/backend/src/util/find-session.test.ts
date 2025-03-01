import { redisClient } from '../app';
import { findSessionKey } from './find-session';


describe('findSession', () => {
  test('find session key', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const redisKeysMock = jest.fn().mockResolvedValue(['key1']);
    jest.spyOn(redisClient, 'keys').mockImplementation(redisKeysMock);

    const redisGetMock = jest.fn().mockResolvedValue({
      passport: { user: { id: 1 } },
    });
    jest.spyOn(redisClient, 'get').mockImplementation(redisGetMock);

    const result = findSessionKey(1);

    expect(result).toBe('key1');
  });

  test('return null if session key is not found', () => {});

  test('return null if no keys are found in Redis client', () => {});
});
