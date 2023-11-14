import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Provider } from '@vacay-planner/models';
import UserRepository from '../sql/repositories/user.repository';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await UserRepository.findUserByProfileId(
          profile.id,
          profile._json.email!,
          Provider.google
        );

        if (existingUser)
          return done(null, existingUser);

        const user = UserRepository.createUser(
          profile._json?.name ?? '',
          profile._json.email!,
          Provider.google,
          profile.id
        );
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);
