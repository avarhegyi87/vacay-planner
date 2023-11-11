import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../sql/models/user';

export const router = express.Router();

router.post('/api/register', (req, res) => {
  const { email, password } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) throw err;

    const newUser = new User({ email: email, password: hash });
    await newUser
      .save()
      .then(() => res.redirect('/'))
      .catch(err => {
        return err;
      });
  });
});

router.post(
  '/api/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/api/login',
  })
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/')
);

export default router;
