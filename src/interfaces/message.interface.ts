/* eslint-disable semi */
import { Document } from 'mongoose';

export interface Message extends Document {
  content?: string;
  sender?: string;
}

export interface IMessage {
  _id?: string;
  content?: string;
  sender?: string;
  roomName?: string;
  createdAt?: string;
  updatedAt?: string;
}
