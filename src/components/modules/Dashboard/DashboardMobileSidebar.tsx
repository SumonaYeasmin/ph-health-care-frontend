"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";
import { UserInfo } from "@/types/user.interface";
import { NavSection } from "@/types/dashboard.interface";

interface DashboardMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

export default function DashboardMobileSidebar({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardMobileSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      {/* Brand Logo Header */}
      <div className="flex h-16 items-center border-b border-slate-200 dark:border-slate-800 px-6">
        <Link href={dashboardHome || "/dashboard"} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            PH
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-white">
            PH Healthcare
          </span>
        </Link>
      </div>

      {/* Navigation Area with Scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-6">
          {navItems && navItems.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.title}
                </h4>
              )}
              <div className="space-y-1">
                {section.items && section.items.map((item, itemIdx) => {
                  const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={itemIdx}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Card at Bottom */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {userInfo?.name ? userInfo.name[0].toUpperCase() : "U"}
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              {userInfo?.name || "User Profile"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              {userInfo?.role || "User"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
