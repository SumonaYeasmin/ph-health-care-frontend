"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { getUserInfo } from "@/src/services/auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";
import { getNavItemsByRole } from "@/src/lib/navitems.config";
import { getDefaultDashboardRoute, UserRole } from "@/src/lib/auth-utils";

export default function DashboardNavbar() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const info = await getUserInfo();
      setUserInfo(info);
    };
    fetchUser();
  }, []);

  // Determine role as fallback
  const getRoleFromPath = (): UserRole => {
    if (pathname.includes("/admin")) return "ADMIN";
    if (pathname.includes("/doctor")) return "DOCTOR";
    return "PATIENT";
  };

  const role = (userInfo?.role || getRoleFromPath()).toUpperCase() as UserRole;
  const navItems = getNavItemsByRole(role);
  const dashboardHome = getDefaultDashboardRoute(role);

  const safeUserInfo: UserInfo = userInfo || {
    name: "User",
    email: "",
    role: role,
  };

  return (
    <header className="sticky top-0 z-40 w-full flex-none">
      <DashboardNavbarContent
        userInfo={safeUserInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />
    </header>
  );
}
