import { unauthorized } from "@hapi/boom";
import Hapi from "@hapi/hapi";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = "HS256";
const AUTHENTICATION_TOKEN_EXPIRATION_HOURS = 72;

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
    }
  } catch (err) {}
};
