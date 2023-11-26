import { NextFunction, Request, Response, Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import PostgresUser from '../sql/models/user';
import UserRepository from '../sql/repositories/user.repository';
import PostgresToken from '../sql/models/token';
import { sendToken } from '../util';
import { updateSessionWithVerified } from '../util/update-session';
import { redisClient } from '..';
import { findSessionKey } from '../util/find-session';

export const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!(email && username && password)) {
    res.status(402).json({ error: 'Bad Request' });
  }

  const existingUser = await UserRepository.findUserByEmail(email);
  if (existingUser)
    return res.status(400).send({
      error:
        'An account already exists with this email address. Please, log in.',
    });

  bcrypt.hash(password!.toString(), 10, async (err, hash) => {
    if (err) throw err;

    const newUser = new PostgresUser({
      email: email,
      username: username,
      password: hash,
      is_admin: false,
      is_verified: false,
      is_active: true,
    });
    try {
      const savedUser = await newUser.save();

      req.login(savedUser, loginErr => {
        if (loginErr) return res.status(500).json({ error: loginErr.message });

        return res.status(200).json(savedUser);
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
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

router.post('/verify', async (req: Request, res: Response) => {
  const { id } = req.body;

  let user = await PostgresUser.findByPk(id);

  if (!user) return res.status(401).json({ message: 'Unauthorized' });
  if (!user.email)
    return res
      .status(402)
      .json({ message: 'No email on user, cannot send verification.' });

  if (user.is_verified)
    return res.status(400).json({ error: 'User already verified' });

  const token = jwt.sign({ data: id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRY ?? '60',
  });

  const [tokenDbEntry, created] = await PostgresToken.findOrCreate({
    where: { userid: user.id },
    defaults: {
      token,
      expire_at: new Date(new Date().getTime() + 60 * 60 * 1000),
    }
  });

  tokenDbEntry.token = token; 

  await tokenDbEntry
    .save()
    .then(() => {
      sendToken(user!.email, token)
        .then(() => {
          return res.status(200).json({message: 'Email sent successfully'});
        })
        .catch(err => {
          return res.status(500).json({
            error: `User created, but verification email could not be sent, error: ${JSON.stringify(
              err.message
            )}`,
          });
        });
    })
    .catch(err => {
      console.error('Error while creating and sending verification token', err);
      return res.status(500).json({
        error: `Verification was not created, error: ${JSON.stringify(
          err.message
        )}`,
      });
    });
});

router.get(
  '/verify/:token',
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    if (!token) return next();

    jwt.verify(token, process.env.JWT_SECRET!, async (err, decoded) => {
      if (err) {
        console.error(`Token verification failed for token ${token}:`, err);
        return res.status(401).json({ err: err.message });
      } else {
        const tokenDbEntry = await PostgresToken.findOne({ where: { token } });
        const user = tokenDbEntry
          ? await PostgresUser.findByPk(tokenDbEntry.userid)
          : undefined;

        if (tokenDbEntry && user) {
          console.log(`Token is valid for user ${user.id}`)
          console.log('session info after getting token db entry:', req.session);

          if (tokenDbEntry.expire_at > new Date()) {
            user.is_verified = true;
            await user.save();
            let session: any = req.session;
            let userInSession = session.passport?.user;
            let sessionKey: string | null = null;

            console.log('user in session:', userInSession)

            if (userInSession) {
              userInSession.is_verified = true;
              req.session.save();
            }
            else {
              console.log('user session was not found, looking up session key...')
              sessionKey = await findSessionKey(user.id);
              console.log('session key:', sessionKey)
              if (sessionKey) {
                session = await redisClient.get(sessionKey);
                console.log('session after finding key:', session)
                if (session) userInSession = JSON.parse(session).passport?.user;
                console.log('user in session after finding key:', userInSession)
                await updateSessionWithVerified(sessionKey, true);
                console.log(`Updated session for ${user.id}:`, session.passport?.user);
              }
            }

            tokenDbEntry.destroy();

            return res.status(200).redirect('/register/verify/?success=true');
          } else {
            console.debug('sending Token expired message from the code');
            return res
              .status(400)
              .send('Token expired')
              .redirect('/register/verify?success=false&error=TokenExpired');
          }
        } else {
          const missing: string = !user
            ? 'User'
            : !tokenDbEntry
            ? 'Token'
            : ''!;
          if (missing) {
            return res
              .status(401)
              .redirect(`/register/verify?success=false&error=${missing}NotFound`);
          } else {
            return res
              .status(401)
              .redirect('/register/verify/?success=false');
          }
        }
      }
    });
  }
);

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
  console.log('session info:', session);
  let user = session.passport?.user;
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
