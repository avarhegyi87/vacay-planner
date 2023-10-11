"use strict";
exports.__esModule = true;
var express_1 = require("express");
var passport_1 = require("passport");
var cookie_session_1 = require("cookie-session");
var routes_1 = require("./routes");
require('./config/passport-config');
var app = (0, express_1["default"])();
app.use((0, cookie_session_1["default"])({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ['asd'] }));
app.use(passport_1["default"].initialize());
app.use(passport_1["default"].session());
app.use('/auth', routes_1.authRoutes);
var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
