import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { authRoutes, calendarRoutes, teamRoutes } from './routes';
import { createClient } from 'redis';
import RedisStore from 'connect-redis'
import cors from 'cors';
import path from 'path';

const app = express();

// set up env
process.env.NODE_ENV ||= 'development';
require('dotenv').config();

app.use(cors())

// initialise Redis client & store for session info
export const redisClient = createClient({url: process.env.REDISCLOUD_URL ?? process.env.UPSTASH_REDIS_URL ?? 'redis://localhost:6379'});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'vacay-planner:',
});

// express-session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    store: redisStore,
    cookie: {
      maxAge: 3 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV !== 'development',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
    },
  })
);

app.use(express.json());

app.use(express.static(path.join(__dirname, 'apps', 'frontend', 'dist', 'frontend')));

// auth routes not requiring session middleware
app.use('/api/auth', authRoutes);

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport-config');

// routes requiring session middleware
app.use('/api/teams', teamRoutes);
app.use('/api/calendars', calendarRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'apps', 'frontend', 'dist', 'frontend', 'index.html'));
});

// start server
const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.info(
    `Server is running on port ${PORT} in ${process.env.NODE_ENV} environment`
  );
});

// Redis event logging
redisClient.on('connect', () => console.log('Connected to Redis server'));
redisClient.on('error', err => console.error('Redis client error:', err));
