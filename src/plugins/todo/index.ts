import Hapi from "@hapi/hapi";
import { addTodoRoute } from "./routes/addTodo";
import { updateTodoRoute } from "./routes/updateTodo";
import { deleteTodoRoute } from "./routes/deleteTodo";
import { getTodoListRoute } from "./routes/getTodoList";

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
