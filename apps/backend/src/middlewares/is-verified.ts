import { NextFunction, Request, Response } from 'express';

export function isVerified(req: Request, res: Response, next: NextFunction) {
  const session: any = req.session;
  if (session?.passport?.user?.is_verified) return next();
  else res.status(401).json({ error: 'Unauthorized' });
}

export default isVerified;
