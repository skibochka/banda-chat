/* eslint-disable semi */
import { Document } from 'mongoose';

export interface User extends Document {
    login?: string;
    password?: string;
    rooms?: any;
}

export interface IUser {
    _id?: string;
    login?: string;
    password?: string;
    rooms?: any;
}
