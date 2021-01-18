import Joi from 'joi';

export default Joi.object({
    from: Joi.string().isoDate(),
    to: Joi.string().isoDate(),
});