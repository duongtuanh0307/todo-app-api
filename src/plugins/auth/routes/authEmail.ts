import { badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import { TokenType } from "@prisma/client";
import { add } from "date-fns";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 3;

type LoginInput = {
  email: string;
};
const loginHandler = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
  const { prisma, sendEmailToken } = request.server.app;
  const payload = request.payload as LoginInput;
  const email = payload.email;
  const emailToken = generateEmailToken();
  const tokenExpiration = add(new Date(), {
    minutes: EMAIL_TOKEN_EXPIRATION_MINUTES,
  });
  try {
    await prisma.token.create({
      data: {
        emailToken,
        type: TokenType.EMAIL,
        expiration: tokenExpiration,
        user: {
          connectOrCreate: {
            create: {
              email,
            },
            where: {
              email,
            },
          },
        },
      },
    });
    await sendEmailToken(email, emailToken);
    return h.response().code(200);
  } catch (err) {
    return badImplementation(err.message);
  }
};

const generateEmailToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authEmailPlugin = {
  method: "POST",
  path: "/auth/login",
  handler: loginHandler,
  options: {
    auth: false,
  },
} as Hapi.ServerRoute;
