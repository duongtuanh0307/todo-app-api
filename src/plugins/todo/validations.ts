import Joi from "@hapi/joi";

const inputTodoValidator = Joi.object({
  content: Joi.string()
    .max(2000)
    .alter({
      create: (schema: any) => schema.required(),
      update: (schema: any) => schema.optional(),
    }),
  note: Joi.string().max(2000).optional(),
  scheduleFor: Joi.date().alter({
    create: (schema: any) => schema.required(),
    update: (schema: any) => schema.optional(),
  }),
  userId: Joi.number().integer().required(),
});

export const createTodoValidator = inputTodoValidator.tailor("create");

export const updateTodoValidator = inputTodoValidator.tailor("update");
