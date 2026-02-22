import { createContext } from 'react';

export type AuthContextData = {
  signed: boolean;
  loadingAuth: boolean;
  user: UserProps | null;
  handleInfoUser: ({ name, email, uid }: UserProps) => void;
};

export interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = createContext({} as AuthContextData);
