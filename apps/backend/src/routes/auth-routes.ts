import express from 'express';
import passport from 'passport';

export const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/api/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/teams')
);

router.get('/api/logout', (req, res) => {
  req.logout(() => console.log('logged out'));
  res.redirect('/');
});

router.get('/api/current_user', (req, res) => res.send(req.user));

export default router;
