import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { NextFunction, Request, Response } from 'express';
import { isVerified } from './is-verified';

describe('isVerified', () => {
  const mockRequest = () => ({ session: {} } as Request);
  const mockResponse = () => {
    const res: Response = {
      status: jest.fn().mockReturnValue({ json: jest.fn() }),
    } as any;
    return res;
  };
  const mockNext: NextFunction = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('call next() function if the user is verified', () => {
    const req: any = mockRequest();
    const res = mockResponse();
    req.session.passport =  { user: { is_verified: true } };

    isVerified(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('return error 401 if the user is not verified', () => {
    const req: any = mockRequest();
    const res = mockResponse();
    req.session.passport = { user: { is_verified: false } };

    isVerified(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status(401).json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });

  test('return error 401 if user is not in session', () => {
    const req: any = mockRequest();
    const res = mockResponse();

    isVerified(req, res, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.status(401).json).toHaveBeenCalledWith({ error: 'Unauthorized' });
  });
});