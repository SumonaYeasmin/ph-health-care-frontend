import React from "react";
import LogoutButton from "@/src/components/shared/LogoutButton";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {/* কমন ড্যাশবোর্ড হেডার */}
      <header className="flex justify-between items-center p-4 border-b bg-background">
        <h2 className="font-bold text-lg">Dashboard</h2>
        <LogoutButton />
      </header>
      
      {/* ড্যাশবোর্ড পেজের কন্টেন্ট */}
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
