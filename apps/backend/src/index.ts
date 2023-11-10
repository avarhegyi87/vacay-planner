import express from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { authRoutes } from './routes';

const app = express();

process.env.NODE_ENV ||= 'development';
require('dotenv').config();

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY!], //[keys.cookieKey!],
    secure: process.env.NODE_ENV !== 'development',
    httpOnly: true,
    sameSite: 'strict',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

require('./config/passport-config');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.info(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} environment`
  );
});
