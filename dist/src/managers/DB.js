"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const envHandler_1 = require("./envHandler");
const URL = (0, envHandler_1.default)('DATABASE_URL').replace('<password>', (0, envHandler_1.default)('DATABASE_PASSWORD'));
const connectToDB = () => mongoose_1.default.connect(URL).then(() => console.log('Connected to Database!'));
exports.default = connectToDB;
//# sourceMappingURL=DB.js.map