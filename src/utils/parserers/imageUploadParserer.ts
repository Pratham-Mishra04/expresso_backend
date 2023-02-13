import * as multer from 'multer';
import {
  multerProfilePicFilter,
  multerProductImgFilter,
} from '../multerConfigs/multerFilter';
import {
  multerProfilePicDiskStorage,
  multerProductImgDiskStorage,
} from '../multerConfigs/multerDiskStorage';

const profilePicUpload = multer({
  fileFilter: multerProfilePicFilter,
  storage: multerProfilePicDiskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const productImgUpload = multer({
  fileFilter: multerProductImgFilter,
  storage: multerProductImgDiskStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // total size of all the images
});

export const profilePicUploadParserer = profilePicUpload.single('profilePic');

export const productImgUploadParserer = productImgUpload.any();
