import passport from 'passport';
import User from '../sql/models/user';

require('./sequelize');
require('./mongodb-config');

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user: User, done) => {
  User.findByPk(user.id).then(user => done(null, user));
});

require('../auth/local-strategy-config');
require('../auth/google-strategy-config');
