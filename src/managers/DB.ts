import mongoose from 'mongoose';
import envHandler from './envHandler';

const URL: string = envHandler('DATABASE_URL').replace(
    '<password>',
    envHandler('DATABASE_PASSWORD')
);

const connectToDB = () =>
    mongoose.connect(URL).then(() => console.log('Connected to Database!'));

export default connectToDB;
