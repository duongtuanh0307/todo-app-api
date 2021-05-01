import { badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import { isCreator } from "../../../utility/auth-helpers";
import { API_AUTH_STATEGY } from "./../../auth/constants";

const deleteTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const todoId = parseInt(request.params.todoId);

  try {
    await prisma.todoItem.delete({
      where: {
        id: todoId,
      },
    });
    return h.response().code(204);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to delete TodoItem");
  }
};

export const deleteTodoRoute = {
  method: "DELETE",
  path: "/todos/{todoId}",
  handler: deleteTodo,
  options: {
    pre: [isCreator],
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
    validate: {
      params: Joi.object({
        todoId: Joi.string(),
      }),
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
