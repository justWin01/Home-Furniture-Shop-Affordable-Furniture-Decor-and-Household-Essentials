// user.model.ts
export interface User {
  id?: number;
  fullname: string; // add this
  email: string;
  password?: string;
  address?: string;
  created_at?: string;
}
