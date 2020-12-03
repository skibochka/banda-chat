import ValidationError from './ValidationError';
import * as express from 'express';

class ErrorHandler {
    handleErrors(error, req, res, next) {
        if (error instanceof ValidationError) {
            return res.status(422).json({
                error: error.name,
                details: error.message,
            });
        }

        res.status(500).json({
            message: error.name,
            details: error.message,
        });

        next(error);
    }

    public init(app: express.Application) {
        app.use(this.handleErrors);
    }
}
export default new ErrorHandler();
