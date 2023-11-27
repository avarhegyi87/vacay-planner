/* eslint-disable no-undef */
const target = `${process.env.APP_URL}:${process.env.PORT}`;

module.exports = {
  '/api/*': {
    target,
    'secure': false,
  },
};
