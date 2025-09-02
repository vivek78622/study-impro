export interface User {
  uid: string;
  name: string;
  email: string;
  photoUrl: string;
  role: "user";
  createdAt: any;
  lastSeenAt: any;
  demo?: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: any;
  priority: "low" | "medium" | "high";
  category: string;
  status: "todo" | "in_progress" | "done";
  progress: number;
  createdAt: any;
  demo?: boolean;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  subject: string;
  due: any;
  status: "not_started" | "in_progress" | "done";
  progress: number;
  grade: string | null;
  notes: string;
  files: string[];
  demo?: boolean;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  streak: number;
  completedToday: boolean;
  lastCompleted: any;
  createdAt: any;
  demo?: boolean;
}

export interface Schedule {
  id: string;
  userId: string;
  title: string;
  date: any;
  start: string;
  end: string;
  category: string;
  location: string;
  notes: string;
  priority: "low" | "medium" | "high";
  reminder: string;
  demo?: boolean;
}

export interface StudySession {
  id: string;
  userId: string;
  mode: "25min" | "60min";
  startTime: any;
  endTime: any | null;
  status: "active" | "completed";
  notes: string;
  demo?: boolean;
}

export interface Expense {
  id: string;
  userId: string;
  date: any;
  category: string;
  amount: number;
  note: string;
  demo?: boolean;
}

export interface Config {
  appId: string;
  branding: {
    name: string;
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  defaults: {
    taskPriority: string;
    studySessionMode: string;
    reminderTime: string;
    theme: string;
  };
  createdAt: any;
  demo?: boolean;
}