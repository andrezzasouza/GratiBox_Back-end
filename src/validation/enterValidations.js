import Joi from 'joi';

const signUpSchema = Joi.object()
  .length(4)
  .keys({
    name: Joi.string().min(2).max(200).required(),
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required(),
    repeatPassword: Joi.string().required().valid(Joi.ref('password'))
  });

const loginSchema = Joi.object()
  .length(2)
  .keys({
    email: Joi.string().min(6).email().required(),
    password: Joi.string().min(6).required()
  });

const tokenSchema = Joi.string()
  .length(36)
  .guid({
    version: ['uuidv4']
  })
  .required();

export { signUpSchema, loginSchema, tokenSchema };
