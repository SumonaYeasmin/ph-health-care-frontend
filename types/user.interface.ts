import { UserRole } from "@/src/lib/auth-utils";

export interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
  admin?: any;
  doctor?: any;
  patient?: any;
}

