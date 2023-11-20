import passport from 'passport';
import PostgresUser from '../sql/models/user';

require('./sequelize-config');
require('./mongodb-config');

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user: PostgresUser, done) => {
  PostgresUser.findByPk(user.id).then(user => done(null, user));
});

require('../auth/local-strategy-config');
require('../auth/google-strategy-config');
