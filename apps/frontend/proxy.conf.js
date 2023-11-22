const target = process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:8080';

module.exports = {
  "/api/*": {
    target,
    "secure": false
  }
}
