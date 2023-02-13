import logger from '../logs/logger.js';

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    logger.error(err.message);
    next(err);
  });
};

export default catchAsync;
