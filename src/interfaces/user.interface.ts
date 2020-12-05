/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface User extends Document {
    login?: string;
    password?: string;
}

export interface IUser {
    _id?: string;
    login?: string;
    password?: string;
}
