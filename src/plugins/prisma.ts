import { PrismaClient } from "@prisma/client";
import Hapi from "@hapi/hapi";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    prisma: PrismaClient;
  }
}

const plugin: Hapi.Plugin<null> = {
  name: "prisma",
  register: async (server: Hapi.Server) => {
    const prisma = new PrismaClient();
    server.app.prisma = prisma;

    server.ext({
      type: "onPostStop",
      method: async (server: Hapi.Server) => {
        server.app.prisma.$disconnect();
      },
    });
  },
};

export default plugin;
