import * as dotenv from 'dotenv';
import logger from '../../logs/logger';

dotenv.config();

const envHandler = (envName:string) => {
  const env = process.env[envName];
  if (!env) {
    logger.error(`ENV ${envName} is not defined.`);
    throw new Error(`ENV ${envName} is not defined.`);
  }
  return env;
};

export default envHandler;
