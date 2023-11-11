import express from 'express';

const logoutRouter = express.Router();

logoutRouter.get('/api/logout', (req: any, res) => {
  req.logout();
  res.redirect('/');
});

logoutRouter.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

export default logoutRouter;
