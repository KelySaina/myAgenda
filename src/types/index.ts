export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface EventFormData {
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}