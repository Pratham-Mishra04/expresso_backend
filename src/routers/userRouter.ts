import * as express from 'express';
import { login, signup } from '../controllers/authController';
import { protect } from '../middlewares/authMiddlewares';
import {
    getUser,
    updateUser,
    deleteUser,
    updatePassword,
} from '../controllers/userController';
import {
    joiUserCreateValidator,
    joiUserUpdateValidator,
} from '../validators/joiValidators/joiUserValidator';
import { userPicUploadParserer } from '../utils/imageProcessing/parserers/imageUploadParserer';
import { resizeUserPic } from '../utils/imageProcessing/resizePic';

const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post(
    '/signup',
    userPicUploadParserer,
    joiUserCreateValidator,
    resizeUserPic,
    signup
);

// userRouter.patch('/updatePassword', protect, updatePassword);
userRouter.patch('/updatePassword', updatePassword);

userRouter
    .route('/:userID')
    // .get(protect, getUser)
    .get(getUser)
    .patch(
        // protect,
        userPicUploadParserer,
        joiUserUpdateValidator,
        resizeUserPic,
        updateUser
    )
    .delete(deleteUser);
    // .delete(protect, deleteUser);

export default userRouter;
