import Hapi from "@hapi/hapi";
import { createUserRoute } from "./routes/createUser";
import { updateUsernameRoute } from "./routes/updateUsername";
import { updateReminderRoute } from "./routes/updateReminderSetting";
import { getUserInfoRoute } from "./routes/getUserInfo";
import { deleteUserRoute } from "./routes/deleteUser";

export const usersPlugin = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async (server: Hapi.Server) => {
    server.route([
      createUserRoute,
      updateUsernameRoute,
      updateReminderRoute,
      getUserInfoRoute,
      deleteUserRoute,
    ]);
  },
};
