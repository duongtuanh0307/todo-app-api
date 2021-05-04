import cron from "node-cron";
import axios from "axios";
import { sendReminderEmail } from "./plugins/email/sendReminder";
import { add } from "date-fns";

type User = {
  id: number;
  email: string;
  reminderSetting: {
    morningTime: string;
    afternoonTime: string;
  };
};

const createReminderFunction = async () => {
  axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
  const userList: { data: User[] } = await axios.get(
    `http://${process.env.HOST}:${process.env.PORT}/users`
  );
  console.log(userList);
  userList.data.forEach((user) => {
    const email = user.email;
    const morningTime = calculateSendingTime(user.reminderSetting.morningTime);
    const afternoonTime = calculateSendingTime(
      user.reminderSetting.afternoonTime
    );
    const todoListApi = "https://google.com"; //TODO: fix this after creating Client.
    sendReminderEmail(email, [morningTime, afternoonTime], todoListApi);
  });
  return;
};

const sendReminderJob = cron.schedule(
  "0 0 * * *",
  () => {
    try {
      createReminderFunction();
    } catch (err) {
      console.log(err);
    } finally {
      console.log("finished create send mail schedule");
    }
  },
  {
    scheduled: true,
    timezone: "Asia/Bangkok",
  }
);

export { sendReminderJob };

const calculateSendingTime = (time: string) => {
  const [hour, minutes, seconds] = time.split(":");
  const sendingTimeStr = add(new Date(), {
    hours: parseInt(hour),
    minutes: parseInt(minutes),
    seconds: parseInt(seconds),
  });
  return new Date(sendingTimeStr).getTime();
};
