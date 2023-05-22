import * as multer from 'multer';
import { multerUserPicFilter } from '../multerConfigs/multerFilter';
import { multerUserPicDiskStorage } from '../multerConfigs/multerDiskStorage';

const userPicUpload = multer({
    fileFilter: multerUserPicFilter,
    storage: multerUserPicDiskStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const userPicUploadParserer = userPicUpload.single('profilePic');
