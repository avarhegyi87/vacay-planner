import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Provider } from '@vacay-planner/models';
import keys from '../keys/keys';
import { createUser, findUserByProfileId } from '../utils';

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID!,
      clientSecret: keys.googleClientSecret!,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('google profile:', profile);

        const existingUser = await findUserByProfileId(profile.id, profile._json.email!, Provider.google);
        if (existingUser) return done(null, existingUser);

        const user = createUser(profile._json?.name || '', profile._json.email!, Provider.google, profile.id);
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);


