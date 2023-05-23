"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const helmet_1 = require("helmet");
const ExpressMongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
const AppError_1 = require("./managers/AppError");
const errorController_1 = require("./controllers/errorController");
const userRouter_1 = require("./routers/userRouter");
const DB_1 = require("./managers/DB");
const envHandler_1 = require("./managers/envHandler");
const consumerRouter_1 = require("./routers/consumerRouter");
const shipperRouter_1 = require("./routers/shipperRouter");
const messagingRouter_1 = require("./routers/messagingRouter");
const connectToSocket_1 = require("./utils/connectToSocket");
const app = express();
app.use(express.json());
app.use(cors());
app.use((0, helmet_1.default)());
app.use(ExpressMongoSanitize());
app.use(express.static(path.join(__dirname, 'public')));
if ((0, envHandler_1.default)('NODE_ENV') === 'dev')
    app.use(morgan('dev'));
(0, DB_1.default)();
const server = app.listen((0, envHandler_1.default)('PORT'), () => {
    console.log(`Server is running on http://127.0.0.1:${process.env.PORT}`);
});
(0, connectToSocket_1.default)(server);
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
});
app.use('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/utils/documentation.html'));
});
app.use('/users', userRouter_1.default);
app.use('/consumer', consumerRouter_1.default);
app.use('/shipper', shipperRouter_1.default);
app.use('/messaging', messagingRouter_1.default);
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Cannot find ${req.originalUrl}`, 404));
});
app.use(errorController_1.default);
exports.default = app;
//# sourceMappingURL=index.js.map