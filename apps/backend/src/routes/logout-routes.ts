import { NextFunction, Request, Response, Router } from 'express';

const logoutRouter = Router();

logoutRouter.get('/api/logout', (req: Request, res: Response, next: NextFunction) => {
  req.session.destroy(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

export default logoutRouter;
