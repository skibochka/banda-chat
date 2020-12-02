/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface usersSchema extends Document {
    login?: string;
    password?: string;
}
