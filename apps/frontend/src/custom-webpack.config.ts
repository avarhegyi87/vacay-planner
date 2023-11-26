// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotEnv = require('dotenv-webpack');
module.exports = {
  plugins: [new dotEnv()],
};
