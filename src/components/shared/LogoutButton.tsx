"use client";

import { logoutUser } from "@/src/services/auth/logoutUser";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react"; // <-- নতুন যুক্ত করা হয়েছে: আইকন ইমপোর্ট

const LogoutButton = () => {
  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <Button 
      onClick={handleLogout}
      className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 border-none"
    >
      <LogOut size={16} /> {/* <-- লগআউট আইকন */}
      Logout
    </Button>
  );
};

export default LogoutButton; 