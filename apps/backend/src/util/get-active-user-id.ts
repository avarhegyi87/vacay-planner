import { Request } from 'express';

export function getActiveUserId(req: Request): number {
  const session: any = req.session;
  const userId: number = session.passport?.user?.id;
  return userId;
}

export default getActiveUserId;
