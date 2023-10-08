import express, { Express } from 'express';
import passport from 'passport';
import cookieSession from 'cookie-session';

const app: Express = express();

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ['asd'] }));
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;
app.listen(PORT);
