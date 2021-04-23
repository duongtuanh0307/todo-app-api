import Hapi from "@hapi/hapi";
import { authEmailPlugin } from "./routes/authEmail";

export const authPlugin: Hapi.Plugin<null> = {
  name: "app/auth",
  dependencies: ["prisma", "hapi-auth-jwt2", "app/email/send-token"],
  register: async (server: Hapi.Server) => {
    server.route([authEmailPlugin]);
  },
};
