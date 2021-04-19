import Hapi from "@hapi/hapi";
import { addTodoRoute } from "./addTodoRoute";
import { updateTodoRoute } from "./updateTodoRoute";
import { deleteTodoRoute } from "./deleteTodoRoute";
import { getTodoListRoute } from "./getTodoListRoute";

export const todosPlugin = {
  name: "app/todos",
  dependencies: ["prisma"],
  register: async (server: Hapi.Server) => {
    server.route([
      addTodoRoute,
      updateTodoRoute,
      deleteTodoRoute,
      getTodoListRoute,
    ]);
  },
};
