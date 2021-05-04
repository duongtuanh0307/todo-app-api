import sendgrid from "@sendgrid/mail";

export const sendReminderEmail = (
  email: string,
  sendingTime: number[],
  todoListUrl: string
) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.log(
      `The SENDGRID_API_KEY env var must be set, otherwise the API won't be able to send emails.`,
      `Using debug mode which logs the email content instead.`
    );
    debugSendReminder(email, sendingTime, todoListUrl);
    return;
  } else {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    sendReminder(email, sendingTime, todoListUrl);
    return;
  }
};

const sendReminder = async (
  email: string,
  sendingTime: number[],
  todoListUrl: string
) => {
  const msg = {
    to: email,
    from: "duongtuanh1996@gmail.com",
    subject: "Login token for the mordern backend API",
    text: `check and update today's Todo at: ${todoListUrl}`,
    send_at: [...sendingTime],
  };

  await sendgrid.send(msg);
};

const debugSendReminder = async (
  email: string,
  sendingTime: number[],
  todoListUrl: string
) => {
  console.log(
    `The reminder will be send to ${email} at ${sendingTime}. Todo page Url will be ${todoListUrl}`
  );
};
