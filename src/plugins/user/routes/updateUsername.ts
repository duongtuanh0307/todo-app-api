import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { User } from "../types";
import { inputUserValidator } from "../validations";
import Joi from "@hapi/joi";

const updateUsername = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const payload = request.payload as User;
  const userId = parseInt(request.params.userId);
  const { email, username } = payload;

  try {
    const targetUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (targetUser?.id !== userId) {
      return h.response("Fobidden request").code(403);
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username: username,
      },
    });
    return h.response(updatedUser).code(200);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to update username");
  }
};

export const updateUsernameRoute = {
  method: "PUT",
  path: "/user/{userId}",
  handler: updateUsername,
  options: {
    validate: {
      payload: inputUserValidator,
      params: Joi.object({ userId: Joi.string() }),
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
