import { badImplementation } from "@hapi/boom";
import { updateTodoValidator } from "./validations";
import Hapi from "@hapi/hapi";

import { TodoItem } from "./types";
import Joi from "@hapi/joi";

const updateTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as Partial<TodoItem> & { userId: number }; //TODO: Remove this and fix pre-condition after adding authentification
  const todoId = parseInt(request.params.todoId);

  try {
    const targetItem = await prisma.todoItem.findUnique({
      where: { id: todoId },
      select: {
        userId: true,
      },
    });
    const itemOwnerId = targetItem?.userId || -1;
    if (itemOwnerId !== payload.userId)
      return h.response("Item can be updated by creator only").code(403);
    const updatedItem = await prisma.todoItem.update({
      where: {
        id: todoId,
      },
      data: payload,
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
