import Joi from "@hapi/joi";

export const inputUserValidator = Joi.object({
  username: Joi.string().max(255).required(),
  email: Joi.string().email().required(),
});
