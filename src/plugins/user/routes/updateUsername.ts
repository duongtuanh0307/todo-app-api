import Hapi from "@hapi/hapi";
import { badImplementation } from "@hapi/boom";

import { inputUserValidator } from "../validations";
import Joi from "@hapi/joi";
import { isRequestedPerson } from "../../../utility/auth-helpers";
import { API_AUTH_STATEGY } from "./../../auth/constants";

const updateUsername = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const payload = request.payload as { username: string };
  const userId = parseInt(request.params.userId);
  const { username } = payload;

  try {
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
    pre: [isRequestedPerson],
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
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
