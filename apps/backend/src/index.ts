import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { authRoutes } from './routes';
import keys from './keys/keys';

const app = express();

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey!] }));
/* app.use(session({
  secret: keys.cookieKey,
  resave: false,
  saveUninitialized: false,
})); */

app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

require('./config/passport-config');

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} environment`
  );
});
