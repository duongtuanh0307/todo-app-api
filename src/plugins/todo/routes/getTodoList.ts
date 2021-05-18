import { API_AUTH_STATEGY } from "./../../auth/constants";
import { badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

const getTodoList = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId);

  try {
    const todosList = await prisma.todoItem.findMany({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        content: true,
        note: true,
        createdAt: true,
        updatedAt: true,
        scheduleFor: true,
        userId: true,
        priority: true,
        category: true,
      },
    });
    return h.response(todosList).code(200);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to get Todo List");
  }
};

export const getTodoListRoute = {
  method: "GET",
  path: "/todos/{userId}",
  handler: getTodoList,
  options: {
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
    validate: {
      params: Joi.object({ userId: Joi.string() }),
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
