import Joi from 'joi';

const dataSchema = Joi.object()
  .length(10)
  .keys({
    type: Joi.string().valid('Semanal', 'Mensal').required(),
    day: Joi.string()
      .valid('Segunda', 'Quarta', 'Sexta', 'Dia 01', 'Dia 10', 'Dia 20')
      .required(),
    tea: Joi.boolean().required(),
    incense: Joi.boolean().required(),
    organic: Joi.boolean().required(),
    name: Joi.string().min(4).max(255).required(),
    street: Joi.string().min(5).max(255).required(),
    formattedCep: Joi.string().min(8).max(8).pattern(/[0-9]/).required(),
    city: Joi.string().min(2).max(255).required(),
    state: Joi.string().min(2).max(2).required()
  });

export { dataSchema };
