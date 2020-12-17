import * as Joi from '@hapi/joi';

class Validation {
  public checkMessage(data) {
    return Joi
      .object({
        content: Joi
          .string()
          .required(),
        roomName: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public getMessages(data) {
    return Joi
      .object({
        roomName: Joi
          .string()
          .required(),
        limit: Joi
          .number()
          .optional(),
        page: Joi
          .number()
          .optional(),
      })
      .validate(data);
  }

  public updateMessages(data) {
    return Joi
      .object({
        msgId: Joi
          .string()
          .required(),
        content: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public deleteMessage(data) {
    return Joi
      .object({
        msgId: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public createRoom(data) {
    return Joi
      .object({
        roomName: Joi
          .string()
          .required(),
      })
      .validate(data);
  }

  public joinRoom(data) {
    return Joi
      .object({
        roomName: Joi
          .string()
          .required(),
      })
      .validate(data);
  }
}
export default new Validation();
