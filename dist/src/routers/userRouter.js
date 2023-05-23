"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authController_1 = require("../controllers/authController");
const authMiddlewares_1 = require("../middlewares/authMiddlewares");
const userController_1 = require("../controllers/userController");
const joiUserValidator_1 = require("../validators/joiValidators/joiUserValidator");
const imageUploadParserer_1 = require("../utils/imageProcessing/parserers/imageUploadParserer");
const resizePic_1 = require("../utils/imageProcessing/resizePic");
const userRouter = express.Router();
userRouter.post('/login', authController_1.login);
userRouter.post('/signup', imageUploadParserer_1.userPicUploadParserer, joiUserValidator_1.joiUserCreateValidator, resizePic_1.resizeUserPic, authController_1.signup);
userRouter.patch('/updatePassword', authMiddlewares_1.protect, userController_1.updatePassword);
userRouter
    .route('/:userID')
    .get(authMiddlewares_1.protect, userController_1.getUser)
    .patch(authMiddlewares_1.protect, imageUploadParserer_1.userPicUploadParserer, joiUserValidator_1.joiUserUpdateValidator, resizePic_1.resizeUserPic, userController_1.updateUser)
    .delete(authMiddlewares_1.protect, userController_1.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map