import express from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';
import { authRoutes } from './routes';
require('./config/passport-config');

const app = express();

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ['asd'] }));
app.use(passport.initialize());
app.use(passport.session());

app.use(authRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} environment`);
});
