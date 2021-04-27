import { TokenType } from ".prisma/client";
import { unauthorized, badImplementation } from "@hapi/boom";
import Hapi from "@hapi/hapi";
import Joi from "@hapi/joi";
import { add } from "date-fns";
import jwt from "jsonwebtoken";
import {
  AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
  JWT_SECRET,
  JWT_ALGORITHM,
} from "../constants";

type AuthenticateInput = {
  email: string;
  emailToken: string;
};

const authApiHandler = async (
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const { email, emailToken } = request.payload as AuthenticateInput;

  try {
    const fetchedEmailToken = await prisma.token.findUnique({
      where: {
        emailToken: emailToken,
      },
      include: {
        user: true,
      },
    });
    if (!fetchedEmailToken?.valid) {
      return unauthorized();
    }
    if (fetchedEmailToken.expiration < new Date()) {
      return unauthorized("Token expired");
    }

    if (fetchedEmailToken?.user?.email === email) {
      const tokenExpiration = add(new Date(), {
        hours: AUTHENTICATION_TOKEN_EXPIRATION_HOURS,
      });
      const createdToken = await prisma.token.create({
        data: {
          type: TokenType.API,
          expiration: tokenExpiration,
          user: {
            connect: {
              email,
            },
          },
        },
      });
      await prisma.token.update({
        where: {
          id: fetchedEmailToken.id,
        },
        data: {
          valid: false,
        },
      });
      const authToken = generateAuthToken(createdToken.id);
      return h.response().code(200).header("Authorization", authToken);
    } else {
      return unauthorized();
    }
  } catch (err) {
    return badImplementation(err.message);
  }
};

const generateAuthToken = (tokenId: number) => {
  const jwtPayload = { tokenId };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  });
};

export const authApiPlugin = {
  method: "POST",
  path: "/authenticate",
  handler: authApiHandler,
  options: {
    auth: false,
    validate: {
      payload: Joi.object({
        email: Joi.string().email().required(),
        emailToken: Joi.string().required(),
      }),
    },
  },
} as Hapi.ServerRoute;
