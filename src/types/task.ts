export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
};

export type User = {
  student: boolean;
  auth: object;
}
