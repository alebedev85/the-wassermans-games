export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; //Дата хранится в виде строки в формате ISO (YYYY-MM-DDTHH:mm:ss.sssZ).
}

export interface Calendar {
  tasks: Task[];
}