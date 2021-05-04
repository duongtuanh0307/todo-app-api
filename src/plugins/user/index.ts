import Hapi from "@hapi/hapi";
import { updateUsernameRoute } from "./routes/updateUsername";
import { updateReminderRoute } from "./routes/updateReminderSetting";
import { getUserInfoRoute } from "./routes/getUserInfo";
import { deleteUserRoute } from "./routes/deleteUser";
import { getReminderSettedUsers } from "./routes/getReminderSettedUsers";

export const usersPlugin = {
  name: "app/users",
  dependencies: ["prisma"],
  register: async (server: Hapi.Server) => {
    server.route([
      updateUsernameRoute,
      updateReminderRoute,
      getUserInfoRoute,
      deleteUserRoute,
      getReminderSettedUsers,
    ]);
  },
};
