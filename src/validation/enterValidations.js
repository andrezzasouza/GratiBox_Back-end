import Joi from 'joi';

const signUpSchema = Joi.object()
  .length()
  .keys({});

const loginSchema = Joi.object()
  .length()
  .keys({});

export { signUpSchema, loginSchema };
