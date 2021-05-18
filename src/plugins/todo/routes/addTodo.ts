import { API_AUTH_STATEGY } from "./../../auth/constants";
import { createTodoValidator } from "../validations";
import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { TodoItem } from "../types";
import { Category, Priority } from ".prisma/client";

const addNewTodo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as TodoItem;
  const priority = payload.priority.toUpperCase() as Priority;
  const category = payload.category.toUpperCase() as Category;

  try {
    const addedItem = await prisma.todoItem.create({
      data: {
        content: payload.content,
        note: payload.note,
        scheduleFor: payload.scheduleFor,
        userId: payload.userId,
        priority: priority,
        category: category,
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
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
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
