import { UserRole } from "@/src/lib/auth-utils";

export interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
  needPasswordChange?: boolean;
  admin?: any;
  doctor?: any;
  patient?: any;
}


