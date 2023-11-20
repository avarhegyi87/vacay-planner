import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import PostgresUser from '../sql/models/user';

export const router = Router();

router.post('/register', (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!(email && username && password)) {
    res.status(422).json({ error: 'Unprocessable content' });
  }

  bcrypt.hash(password!.toString(), 10, async (err, hash) => {
    if (err) throw err;

    const newUser = new PostgresUser({
      email: email,
      username: username,
      password: hash,
      is_admin: false,
    });
    await newUser
      .save()
      .then(user => {
        res.status(200).send(user);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  });
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: Error, user: any, info: any) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    req.login(user, loginErr => {
      if (loginErr) return res.status(500).json({ error: loginErr.message });

      return res
        .status(200)
        .json({ message: 'Authentication successful', user });
    });
  })(req, res, next);
});

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => res.redirect('/')
);

router.get('/current_user', (req: Request, res: Response) => {
  const session: any = req.session;
  let user = session.passport?.user;
  if (user) user.password = null;
  res.send(user);
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying the session:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});

export default router;
