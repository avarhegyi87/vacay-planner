import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AccountsTable, UsersTable } from '../models';
import { ProviderType } from '@vacay-planner/models';
import keys from '../keys/keys';

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

        const existingUser = await findUserByProfileId(profile.id);
        if (existingUser) return done(null, existingUser);

        const user = new UsersTable({
          username: profile.username,
          email: profile.emails,
          created_at: new Date(),
        });
        await user.save();
        const account = await new AccountsTable({
          id: user.id,
          provider: ProviderType.google,
          accountid: profile.id,
        });
        account.save();

        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

const findUserByProfileId = async (profileid: string) => {
  const accountEntry = await AccountsTable.findOne({
    where: { provider: ProviderType.google, accountid: profileid },
  });

  if (accountEntry) {
    const existingUser = await UsersTable.findByPk(accountEntry.userid);
    if (existingUser) return existingUser.id;
  }
};
