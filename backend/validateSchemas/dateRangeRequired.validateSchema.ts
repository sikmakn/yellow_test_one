import Joi from 'joi';

export default Joi.object({
    from: Joi.string().isoDate().required(),
    to: Joi.string().isoDate().required(),
});