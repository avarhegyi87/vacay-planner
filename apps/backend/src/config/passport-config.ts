import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AccountsTable, UsersTable } from '../models';
import { ProviderType } from '@vacay-planner/models';

passport.use(
  new GoogleStrategy(
    {
      clientId: process.env.GOOGLE_CLIENT_ID || 'client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'client_secret',
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await findUserByProfileId(profile.id);
        if (existingUser) return done(null, existingUser);

        const user = await new UsersTable({
          username: profile.username,
          email: profile.email,
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
        return done(error);
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
