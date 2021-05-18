//Accept time format HH:MM:SS only, use for reminder time of ReminderSetting
export const isValidReminderTime = (time: string) => {
  const regEx = /^(((([0-1][0-9])|(2[0-3])):?[0-5][0-9]:?[0-5][0-9]+$))/g;
  return regEx.test(time);
};
//Accept date format  YYYY-MM-DD only
export const isValidDate = (date: string) => {
  const regEx = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g;
  return regEx.test(date);
};
