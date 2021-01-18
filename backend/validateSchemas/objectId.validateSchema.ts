import Joi from 'joi';

export default Joi.string().pattern(/^[a-f\d]{24}$/i).required();