import { badImplementation, badRequest } from "@hapi/boom";
import { updateTodoValidator } from "../validations";
import Hapi from "@hapi/hapi";

import { TodoItem } from "../types";
import Joi from "@hapi/joi";
import { Category, Priority } from ".prisma/client";
import { isValidDate } from "../../../utility/helpers";
import { isCreator } from "../../../utility/auth-helpers";
import { API_AUTH_STATEGY } from "./../../auth/constants";

const updateTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as Partial<TodoItem> & { userId: number };
  const todoId = parseInt(request.params.todoId);
  const priority = payload.priority?.toUpperCase() as Priority;
  const category = payload.category?.toUpperCase() as Category;
  const scheduleFor = payload.scheduleFor;

  if (scheduleFor && isValidDate(scheduleFor))
    return badRequest("Format of Date should be YYYY-MM-DD");

  try {
    const updatedItem = await prisma.todoItem.update({
      where: {
        id: todoId,
      },
      data: {
        ...payload,
        priority: priority,
        category: category,
        scheduleFor: scheduleFor,
      },
    });
    return h.response(updatedItem).code(200);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to update TodoItem");
  }
};

export const updateTodoRoute = {
  method: "PUT",
  path: "/todos/{todoId}",
  handler: updateTodo,
  options: {
    pre: [isCreator],
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
    validate: {
      payload: updateTodoValidator,
      params: Joi.object({ todoId: Joi.string() }),
      failAction: (
        request: Hapi.Request,
        h: Hapi.ResponseToolkit,
        err: Error
      ) => {
        throw err;
      },
    },
  },
} as Hapi.ServerRoute;
