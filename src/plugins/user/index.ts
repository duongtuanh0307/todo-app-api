import Hapi from "@hapi/hapi";
import { createUserRoute } from "./routes/createUser";
import { updateUsernameRoute } from "./routes/updateUsername";

export const usersPlugin = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async (server: Hapi.Server) => {
    server.route([createUserRoute, updateUsernameRoute]);
  },
};
