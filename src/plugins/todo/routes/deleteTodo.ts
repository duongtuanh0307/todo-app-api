import { badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

const deleteTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as { userId: number }; //TODO: Remove this and fix pre-condition after adding authentification
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
      return h.response("Item can be deleted by creator only").code(403);
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
