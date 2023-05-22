"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const logger_1 = require("../../logs/logger");
dotenv.config();
const envHandler = (envName) => {
    const env = process.env[envName];
    if (!env) {
        logger_1.default.error(`ENV ${envName} is not defined.`);
        throw new Error(`ENV ${envName} is not defined.`);
    }
    return env;
};
exports.default = envHandler;
//# sourceMappingURL=envHandler.js.map