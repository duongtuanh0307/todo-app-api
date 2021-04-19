export type TodoItem = {
  content: string;
  note?: string;
  scheduleFor: string;
  userId: number;
  priority: "low" | "normal" | "high";
  category: "work" | "private";
};
