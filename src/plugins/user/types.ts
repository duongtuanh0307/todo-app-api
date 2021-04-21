export type User = {
  username: string;
  email: string;
};

export type ReminderSetting = {
  active: boolean;
  morningTime: string;
  afternoonTime: string;
  userId: number;
};
