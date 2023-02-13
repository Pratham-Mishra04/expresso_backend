import dotenv from 'dotenv';
import logger from '../logs/logger.js';

dotenv.config();

const envHandler = (envName) => {
  const env = process.env[envName];
  if (!env) {
    logger.error(`ENV ${envName} is not defined.`);
    throw new Error(`ENV ${envName} is not defined.`);
  }
  return env;
};

export default envHandler;
