const target = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000';

module.exports = {
  "/api/*": {
    target,
    "secure": false
  }
}
