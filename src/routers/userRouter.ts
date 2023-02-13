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
import { profilePicUploadParserer } from '../utils/parserers/imageUploadParserer';
import { resizeProfilePic } from '../utils/resizePic';

const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post(
  '/signup',
  profilePicUploadParserer,
  joiUserCreateValidator,
  resizeProfilePic,
  signup
);

userRouter.patch('/updatePassword', protect, updatePassword);

userRouter
  .route('/:userID')
  .get(protect, getUser)
  .patch(
    protect,
    profilePicUploadParserer,
    joiUserUpdateValidator,
    resizeProfilePic,
    updateUser
  )
  .delete(protect, deleteUser);

export default userRouter;
