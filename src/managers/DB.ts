import mongoose from 'mongoose';
import { DEV_DATABASE_URL } from '../constants';
import envHandler from './envHandler';

const URL:string =
  envHandler('NODE_ENV') == 'dev'
    ? DEV_DATABASE_URL
    : envHandler('DATABASE_URL').replace(
        '<password>',
        envHandler('DATABASE_PASSWORD')
      );

const connectToDB = () =>
  mongoose.connect(URL).then(() => console.log('Connected to Database!'));

export default connectToDB;
