import Hapi from "@hapi/hapi";
import { authEmailPlugin } from "./routes/authEmail";
import { authApiPlugin } from "./routes/authApi";
import { API_AUTH_STATEGY, JWT_SECRET, JWT_ALGORITHM } from "./constants";
import Joi from "@hapi/joi";

export const authPlugin: Hapi.Plugin<null> = {
  name: "app/auth",
  dependencies: ["prisma", "hapi-auth-jwt2", "app/email/send-token"],
  register: async (server: Hapi.Server) => {
    if (!process.env.JWT_SECRET) {
      server.log("warn", "The JWT_SECRET env var is not set");
    }
    server.auth.strategy(API_AUTH_STATEGY, "jwt", {
      key: JWT_SECRET,
      verifyOptions: { algorithm: [JWT_ALGORITHM] },
      validate: validateAPIToken,
    });
    server.auth.default(API_AUTH_STATEGY);
    server.route([authEmailPlugin, authApiPlugin]);
  },
};

type APITokenPayload = {
  tokenId: number;
};

const apiTokenSchema = Joi.object({
  tokenId: Joi.number().integer().required(),
});

const validateAPIToken = async (
  decoded: APITokenPayload,
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
) => {
  const { prisma } = request.server.app;
  const { tokenId } = decoded;
  const { error } = apiTokenSchema.validate(decoded);

  if (error) {
    request.log(["error", "auth"], `API token error: ${error.message}`);
    return { isValid: false };
  }

  try {
    const fetchedToken = await prisma.token.findUnique({
      where: {
        id: tokenId,
      },
      include: {
        user: true,
      },
    });

    if (!fetchedToken || !fetchedToken?.valid) {
      return { isValid: false, errorMessage: "Invalid Token" };
    }

    if (fetchedToken.expiration < new Date()) {
      return { isValid: false, errorMessage: "Token expired" };
    }

    return {
      isValid: true,
      credentials: {
        tokenId: decoded.tokenId,
        userId: fetchedToken.userId,
      },
    };
  } catch (error) {
    request.log(["error", "auth", "db"], error);
    return { isValid: false };
  }
};
