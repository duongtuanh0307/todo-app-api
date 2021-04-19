import { createTodoValidator } from "./validations";
import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { TodoItem } from "./types";

const addNewTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as TodoItem;

  try {
    const addedItem = await prisma.todoItem.create({
      data: {
        content: payload.content,
        note: payload.note,
        scheduleFor: payload.scheduleFor,
        userId: payload.userId,
      },
      select: {
        id: true,
        content: true,
        note: true,
        createdAt: true,
        updatedAt: true,
        scheduleFor: true,
        userId: true,
      },
    });
    return h.response(addedItem).code(201);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to create new TodoItem");
  }
};

export const addTodoRoute = {
  method: "POST",
  path: "/todos/add",
  handler: addNewTodo,
  options: {
    validate: {
      payload: createTodoValidator,
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
