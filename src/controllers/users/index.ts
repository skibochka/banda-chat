import UsersServices from '../../services/service';
import UsersValidation from './validation';
import ValidationError from '../../error/ValidationError';
import IUser from "../../interfaces/users.interface";

class Users {
    public async getAll(req, res, next): Promise<Express.Response> {
        const users = await UsersServices.getAll();
        if (!users) {
            res.status(404).json({
                error: 'Users not found',
            });
            next('Users not found');
        }

        return res.status(200).send(users);
    }

    public async create(req, res): Promise<Express.Response> {
        const { error } = UsersValidation.createPatient(req.body);

        if (error) throw new ValidationError(error.details);

        const user: IUser = await UsersServices.create(req.body);

        return res.status(200).send({
            user,
        })
    }
}

export default new Users();
