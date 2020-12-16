/* eslint-disable semi */
import { Document } from 'mongoose';

export interface Room extends Document {
  roomName?: string;
  members?: string[];
}

export interface IRoom {
  _id?: string;
  roomName?: string;
  members?: string[];
}
