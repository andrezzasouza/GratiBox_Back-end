import Joi from 'joi';

const addressSchema = Joi.object()
  .length()
  .keys({});

export { addressSchema };
