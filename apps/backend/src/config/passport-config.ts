import passport from 'passport';
import { UsersTable } from '../models';
import { Identifier } from 'sequelize';

require('./postgres-config');
require('./mongodb-config');

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((id, done) =>
  UsersTable.findByPk(id as Identifier).then(user => done(null, user))
);

require('./google-strategy-config');

