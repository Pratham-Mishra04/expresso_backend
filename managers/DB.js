import mongoose from 'mongoose';
import { DEV_DATABASE_URL } from '../constants.js';
import envHandler from './envHandler.js';

const URL =
  envHandler('NODE_ENV') == 'dev'
    ? DEV_DATABASE_URL
    : envHandler('DATABASE_URL').replace(
        '<password>',
        envHandler('DATABASE_PASSWORD')
      );

const connectToDB = () =>
  mongoose.connect(URL).then(() => console.log('Connected to Database!'));

export default connectToDB;
