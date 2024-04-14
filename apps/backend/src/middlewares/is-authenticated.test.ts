import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import isAuthenticated from './is-authenticated';

describe('isAuthenticated', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = { isAuthenticated: jest.fn() };
    res = {
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any,
    };
    next = jest.fn();
  });
  
  afterEach(() => {
    next.mockClear();
  });

  test('call next() function if the user is authenticated', () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(true);

    isAuthenticated(req as Request, res as Response, next as any);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('throw error 401 if req is not authenticated', () => {
    (req.isAuthenticated as jest.Mock).mockReturnValue(false);

    isAuthenticated(req as Request, res as Response, next as any);
  
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});
