

import { NavSection } from "@/types/dashboard.interface";

import DashboardSidebarContent from "./DashboardSidebarContent";
import { getUserInfo } from "@/src/services/auth/getUserInfo";
import { UserInfo } from "@/types/user.interface";
import { getNavItemsByRole } from "@/src/lib/navitems.config";
import { getDefaultDashboardRoute } from "@/src/lib/auth-utils";

const DashboardSidebar = async () => {
  const userInfo = (await getUserInfo()) as UserInfo;

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardSidebar;