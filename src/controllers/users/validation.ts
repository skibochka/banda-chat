import * as Joi from '@hapi/joi';

class UsersValidation {
    public createPatient(data) {
        return Joi
            .object({
                login: Joi
                    .string()
                    .required(),
                password: Joi
                    .string()
                    .required(),
            })
            .validate(data);
    }
}

export default new UsersValidation();
