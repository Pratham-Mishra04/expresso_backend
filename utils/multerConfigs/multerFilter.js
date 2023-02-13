import AppError from '../../managers/AppError.js';

export const multerProfilePicFilter = (req, file, cb) => {
  // runs for each file
  if (file.fieldname == 'profilePic') {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Only image files are allowed', 400), false);
  } else cb(new AppError('Invalid input', 400), false);
};

export const multerProductImgFilter = (req, file, cb) => {
  if (file.fieldname == 'image') {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(new AppError('Only image files are allowed', 400), false);
  } else cb(new AppError('Invalid input', 400), false);
};
