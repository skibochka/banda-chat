/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface IUser extends Document {
    login?: string;
    password?: string;
}
