export interface User {
  id: number;
  username?: string;
  email: string;
  password?: string;
  is_admin?: boolean;
  is_active: boolean;
  is_verified: boolean;
}
