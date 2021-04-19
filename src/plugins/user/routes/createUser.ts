import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { User } from "../types";
import { inputUserValidator } from "../validations";

const createUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const payload = request.payload as User;

  try {
    const createdUser = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
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
