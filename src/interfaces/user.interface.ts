/* eslint-disable semi */
import { Document } from 'mongoose';

export interface User extends Document {
    name?: string;
    email?: string;
    password?: string;
    avatar?: string;
    rooms?: any;
}

export interface IUser {
    _id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    password?: string;
    rooms?: any;
}
