import Hapi from "@hapi/hapi";
import sendgrid from "@sendgrid/mail";

declare module "@hapi/hapi" {
  interface ServerApplicationState {
    sendEmailToken(email: string, token: string): Promise<void>;
  }
}

export const sendTokenPlugin = {
  name: "app/email/send-token",
  register: async function (server: Hapi.Server) {
    if (!process.env.SENDGRID_API_KEY) {
      console.log(
        `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails.`,
        `Using debug mode which logs the email tokens instead.`
      );
      server.app.sendEmailToken = debugSendEmailToken;
    } else {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      server.app.sendEmailToken = sendEmailToken;
    }
  },
};

const sendEmailToken = async (email: string, token: string) => {
  const msg = {
    to: "duongtuanh3796@gmail.com",
    from: "duongtuanh3796@gmail.com",
    subject: `Login token for ${email}`,
    text: `Your verify code is ${token}. Verify code will expire after 15 minutes`,
  };

  await sendgrid.send(msg);
};

const debugSendEmailToken = async (email: string, token: string) => {
  console.log(`email token for ${email}: ${token}`);
};
