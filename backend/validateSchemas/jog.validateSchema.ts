import Joi from 'joi';

export default Joi.object({
    date: Joi.string().isoDate().required(),
    distance: Joi.number().integer().min(1).required(),
    time: Joi.number().integer().min(1).required(),
});