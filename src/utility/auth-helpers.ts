import Hapi from "@hapi/hapi";
import { forbidden } from "@hapi/boom";

// Pre function to check if user is creator of an item, can view/edit/delete it:
export const isCreator = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { userId } = request.auth.credentials;
  const todoId = parseInt(request.params.todoId);

  const { prisma } = request.server.app;
  const todoItem = await prisma.todoItem.findUnique({
    where: {
      id: todoId,
    },
    select: {
      userId: true,
    },
  });
  if (todoItem?.userId === userId) {
    return h.continue;
  }
  throw forbidden();
};

//pre function to check if requested user id match current user id as noone accept for the user him-/her-self can view/modify his/her info:
export const isRequestedPerson = (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { userId } = request.auth.credentials;
  const requestedId = parseInt(request.params.userId);
  if (userId === requestedId) {
    return h.continue;
  }
  throw forbidden();
};
