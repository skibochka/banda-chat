import UsersServices from '../../services/service';
import UsersValidation from './validation';
import ValidationError from '../ValidationError';
import IUser from "../../interfaces/users.interface";

class Users {
    public async getAll(req, res, next): Promise<Express.Response> {
        try {
            const users = await UsersServices.getAll();
            if (!users) {
                res.status(404).json({
                    error: 'Users not found',
                });
                next('Users not found');
            }

            return res.status(200).send(users);
        } catch (error) {
            res.status(500).json({
                message: error.name,
                details: error.message,
            });

            return next(error);
        }
    }

    public async create(req, res, next): Promise<Express.Response> {
        try {
            const { error } = UsersValidation.createPatient(req.body);

            if (error) {
                throw new ValidationError(error.details);
            }

            const user: IUser = await UsersServices.create(req.body);

            return res.status(200).send({
                user,
            })
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(422).json({
                    message: error.name,
                    details: error.message,
                });
            }

            res.status(500).json({
                message: error.name,
                details: error.message,
            });

            return next(error);
        }
    }
}

export default new Users();
