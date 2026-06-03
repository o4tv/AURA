import type { Task } from "@/types/task";

export type ClassNotice = {
  id: string;
  message: string;
  createdAt: string;
  expiresOn: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  tasks: Task[];
  notices: ClassNotice[];
};
