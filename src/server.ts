import Hapi from "@hapi/hapi";
import status from "./plugins/status";
import prisma from "./plugins/prisma";
import { todosPlugin } from "./plugins/todo";
import { usersPlugin } from "./plugins/user";

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3030,
  host: process.env.HOST || "localhost",
});

export const createServer = async () => {
  await server.register([status, prisma, todosPlugin, usersPlugin]);
  await server.initialize();

  return server;
};

export const startServer = async (server: Hapi.Server) => {
  await server.start();
  console.log(`Server running on ${server.info.uri}`);

  return server;
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  process.exit(1);
});
