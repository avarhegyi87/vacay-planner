"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const cookie_session_1 = tslib_1.__importDefault(require("cookie-session"));
const app = (0, express_1.default)();
app.use((0, cookie_session_1.default)({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ['asd'] }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const PORT = process.env.PORT || 5000;
app.listen(PORT);
//# sourceMappingURL=index.js.map