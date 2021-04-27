import Hapi from "@hapi/hapi";
import { badImplementation, badRequest } from "@hapi/boom";
import Joi from "@hapi/joi";
import { isRequestedPerson } from "../../../utility/auth-helpers";
import { API_AUTH_STATEGY } from "./../../auth/constants";

const getUserInfo = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId);

  try {
    const userInfo = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        reminderSetting: true,
      },
    });
    if (userInfo) return h.response(userInfo).code(200);
    return badRequest("Not found user");
  } catch (err) {
    request.log("error", err);
    return badImplementation("Something went wrong");
  }
};

export const getUserInfoRoute = {
  method: "GET",
  path: "/user/{userId}",
  handler: getUserInfo,
  options: {
    pre: [isRequestedPerson],
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
    validate: {
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
