import passport from 'passport';
import LocalStrategy from 'passport-local';
import PostgresUser from '../sql/models/user';
import bcrypt from 'bcryptjs';

passport.use(
  new LocalStrategy.Strategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await PostgresUser.findOne({ where: { email: email } });

        if (!user)
          return done(null, false, { message: 'Invalid credentials.' });

        if (!user.password) {
          return done(null, false, {
            message:
              'Account used with a service provider, please use it to log in.',
          });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) return done(null, user);
        else return done(null, false, { message: 'Invalid credentials.' });
      } catch (error) {
        return done(error);
      }
    },
  ),
);
