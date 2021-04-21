import Hapi from "@hapi/hapi";
import { badImplementation, badRequest } from "@hapi/boom";
import Joi from "@hapi/joi";

import { isValidReminderTime } from "../../../utility/helpers";
import { ReminderSetting } from "../types";

const updateReminderSetting = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const payload = request.payload as ReminderSetting;
  const userId = parseInt(request.params.userId);
  const { active, morningTime, afternoonTime } = payload;

  if (
    !isValidReminderTime(morningTime) ||
    !isValidReminderTime(afternoonTime)
  ) {
    return h.response("Available time format is HH:MM:SS").code(400);
  }
  try {
    const targetSetting = await prisma.reminderSetting.findFirst({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    if (!targetSetting) return badRequest("Not found items");
    const settingId = targetSetting.id;
    const updatedSetting = await prisma.reminderSetting.update({
      where: {
        id: settingId,
      },
      data: {
        active: active,
        morningTime: morningTime,
        afternoonTime: afternoonTime,
      },
    });
    return h.response(updatedSetting).code(200);
  } catch (err) {
    request.log("error", err);
    return badImplementation("failed to create new user");
  }
};

export const updateReminderRoute = {
  method: "PUT",
  path: "/user/reminder/{userId}",
  handler: updateReminderSetting,
  options: {
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
