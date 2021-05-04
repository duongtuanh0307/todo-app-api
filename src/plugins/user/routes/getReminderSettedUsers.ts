import Hapi from "@hapi/hapi";
import { badImplementation, badRequest } from "@hapi/boom";
import Joi from "@hapi/joi";

const getUsers = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;

  try {
    const users = await prisma.user.findMany({
      where: {
        reminderSetting: {
          active: true,
        },
      },
      select: {
        id: true,
        email: true,
        reminderSetting: {
          select: {
            morningTime: true,
            afternoonTime: true,
          },
        },
      },
    });
    if (users) return h.response(users).code(200);
    return badRequest("Not found user");
  } catch (err) {
    request.log("error", err);
    return badImplementation("Something went wrong");
  }
};

export const getReminderSettedUsers = {
  method: "GET",
  path: "/users",
  handler: getUsers,
  options: {
    auth: false,
  },
} as Hapi.ServerRoute;
