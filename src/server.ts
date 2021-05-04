import Hapi from "@hapi/hapi";
import status from "./plugins/status";
import prisma from "./plugins/prisma";
import { todosPlugin } from "./plugins/todo";
import { usersPlugin } from "./plugins/user";
import { sendTokenPlugin } from "./plugins/email/sendToken";
import { authPlugin } from "./plugins/auth";
import hapiAuthJWT from "hapi-auth-jwt2";
import { sendReminderJob } from "./cron-jobs";

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT || 3030,
  host: process.env.HOST || "localhost",
});

export const createServer = async () => {
  await server.register([
    hapiAuthJWT,
    authPlugin,
    status,
    prisma,
    todosPlugin,
    usersPlugin,
    sendTokenPlugin,
  ]);
  await server.initialize();
  sendReminderJob;

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
