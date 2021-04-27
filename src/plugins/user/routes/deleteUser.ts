import { badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";

import { isRequestedPerson } from "../../../utility/auth-helpers";
import { API_AUTH_STATEGY } from "./../../auth/constants";

const deleteUser = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma } = request.server.app;
  const userId = parseInt(request.params.userId);

  try {
    const deleteUser = prisma.user.delete({
      where: {
        id: userId,
      },
    });
    const deleteReminderSetting = prisma.reminderSetting.deleteMany({
      where: {
        userId: userId,
      },
    });
    const deleteTodos = prisma.todoItem.deleteMany({
      where: {
        userId: userId,
      },
    });

    await prisma.$transaction([deleteUser, deleteReminderSetting, deleteTodos]);
    return h.response().code(204);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to delete user");
  }
};

export const deleteUserRoute = {
  method: "DELETE",
  path: "/user/{userId}",
  handler: deleteUser,
  options: {
    pre: [isRequestedPerson],
    auth: {
      mode: "required",
      strategy: API_AUTH_STATEGY,
    },
    validate: {
      params: Joi.object({
        todoId: Joi.string(),
      }),
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
