import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { authRoutes } from './routes';
import sequelize from './config/sequelize';

const app = express();

process.env.NODE_ENV ||= 'development';
require('dotenv').config();

console.debug('process envs loaded in index.ts:');

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: new (require('connect-session-sequelize')(session.Store))({ db: sequelize }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      sameSite: 'strict',
    }
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
