/* eslint-disable no-undef */
import dotenv from 'dotenv';

process.env.NODE_ENV ||= 'development';
dotenv.config();

module.exports = {
  'development': {
    'username': process.env.POSTGRES_USERNAME,
    'password': process.env.POSTGRES_PASSWORD,
    'database': process.env.POSTGRES_DATABASE,
    'host': process.env.POSTGRES_HOST,
    'dialect': 'postgres',
  },
  'test': {
    'url': process.env.DATABASE_URL,
    'dialect': 'postgres',
    'dialectOptions': {
      'ssl': {
        'require': true,
        'rejectUnauthorized': false,
      },
    },
  },
  'production': {
    'url': process.env.DATABASE_URL,
    'dialect': 'postgres',
    'dialectOptions': {
      'ssl': {
        'require': true,
        'rejectUnauthorized': false,
      },
    },
  },
};
