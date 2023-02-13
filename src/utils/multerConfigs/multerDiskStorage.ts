import * as path from 'path';
import * as multer from 'multer';

export const multerProfilePicDiskStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, `./public/users/profilePics`);
  },
  filename(req, file, callback) {
    const name = `${req.body.username}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    req.body[`${file.fieldname}`] = name;
    callback(null, name);
  },
});

export const multerProductImgDiskStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, `./public/products/images`);
  },
  filename(req, file, callback) {
    const name = `${req.user.username}-${req.body.title}-${
      Math.random() * 1000
    }${path.extname(file.originalname)}`;
    try {
      req.body.images.push(name);
    } catch (err) {
      req.body.images = [];
      req.body.images.push(name);
    }
    callback(null, name);
  },
});
