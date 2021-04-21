import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { User } from "../types";
import { inputUserValidator } from "../validations";

const createUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as User;
  const DEFAULT_REMINDER_MORNING = "07:00:00";
  const DEFAULT_REMINDER_AFTERNOON = "19:00:00";

  try {
    const createdUser = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        reminderSetting: {
          create: {
            active: false,
            morningTime: DEFAULT_REMINDER_MORNING,
            afternoonTime: DEFAULT_REMINDER_AFTERNOON,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        reminderSetting: true,
      },
    });
    if (!createdUser) throw new Error();
    return h.response(createdUser).code(201);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to create new user");
  }
};

export const createUserRoute = {
  method: "POST",
  path: "/user",
  handler: createUser,
  options: {
    validate: {
      payload: inputUserValidator,
      failAction: (
        request: Hapi.Request,
        h: Hapi.ResponseToolkit,
        err: Error
      ) => {
        throw err;
      },
    },
  },
} as Hapi.ServerRoute;
