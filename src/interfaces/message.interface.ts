/* eslint-disable semi */
import { Document } from 'mongoose';

export default interface Message extends Document {
  content?: string;
  sender?: string;
}

export interface IMessage {
  _id?: string;
  content?: string;
  sender?: string;
  createdAt?: string;
  updatedAt?: string;
}
