import sharp from 'sharp';
import fs from 'fs';
import slugify from 'slugify';
import logger from '../logs/logger.js';

export const resizePic = (picPath, toPath, d1, d2) => {
  const promise = fs.promises.readFile(picPath);

  Promise.resolve(promise)
    .then((buffer) => {
      sharp(buffer)
        .resize(d1, d2)
        .toFormat('jpeg')
        .jpeg({ quality: 100 })
        .toFile(toPath);

      fs.unlinkSync(picPath, (err) => {
        next(err);
      });
    })
    .catch((err) =>
      logger.error(`Error in Resizing ${picPath}: ${err.message}`)
    );
};

export const resizeProfilePic = (req, res, next) => {
  if (!req.file) return next();

  const picPath = `${req.file.destination}/${req.file.filename}`;
  const toPath = `public/users/profilePics/${slugify(
    req.body.username
  )}-${Date.now()}.jpeg`;

  resizePic(picPath, toPath, 500, 500);

  req.body.profilePic = toPath.split('/')[3];

  next();
};

export const resizeProductPics = (req, res, next) => {
  if (!req.body.images) return next();

  const resizedImgs = [];

  req.body.images.forEach((loc, i) => {
    const picPath = `public/products/images/${loc}`;
    const toPath = `public/products/images/${slugify(
      req.user.username
    )}-${slugify(req.body.title)}-${i}-${Date.now()}.jpeg`;

    resizePic(picPath, toPath, 1280, 720);

    resizedImgs.push(toPath);
  });

  req.body.images = resizedImgs;
  next();
};
