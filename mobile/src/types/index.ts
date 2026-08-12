export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: number;
  completed: boolean;
  isVoice?: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}
