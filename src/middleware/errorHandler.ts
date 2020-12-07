import * as express from 'express';
import { AuthenticationError } from './AuthError';
import ValidationError from './ValidationError';

class ErrorHandler {
  public init(app: express.Application) {
    app.use((error, req, res, next): express.NextFunction => {
      if (error instanceof ValidationError) {
        res.status(422).json({
          error: error.name,
          details: error.message,
        });

        return next(error);
      } if (error instanceof AuthenticationError) {
        res.status(401).json({
          error: error.name,
          details: error.message,
        });

        return next(error);
      }

      res.status(500).json({
        message: error.name,
        details: error.message,
      });

      return next(error);
    });
  }
}
export default new ErrorHandler();
