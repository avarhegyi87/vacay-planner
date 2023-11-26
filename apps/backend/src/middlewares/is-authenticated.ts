import { NextFunction, Request, Response } from 'express';

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) return next();
  else res.status(401).json({ error: 'Unauthorized' });
}

export default isAuthenticated;
