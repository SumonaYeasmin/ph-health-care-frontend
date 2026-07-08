import React from "react";
import DashboardSidebar from "@/src/components/modules/Dashboard/DashboardSidebar";
import DashboardNavbar from "@/src/components/modules/Dashboard/DashboardNavbar";

const PatientDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar (বামে থাকবে) */}
      <DashboardSidebar />

      {/* Main Content Area (ডানে থাকবে) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar />

        {/* ড্যাশবোর্ড পেজের কন্টেন্ট */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboardLayout;