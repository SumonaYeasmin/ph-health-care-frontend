"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet"; 
import LogoutButton from "./LogoutButton"; // <-- নতুন যুক্ত করা হয়েছে: LogoutButton ইমপোর্ট করা হলো
import { useSearchParams, useRouter } from "next/navigation"; // <-- নতুন যুক্ত করা হয়েছে
import toast from "react-hot-toast"; // <-- নতুন যুক্ত করা হয়েছে

const PublicNavbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => { // <-- নতুন যুক্ত করা হয়েছে: isLoggedIn প্রপ রিসিভ করা হলো
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams(); // <-- নতুন যুক্ত করা হয়েছে
  const router = useRouter(); // <-- নতুন যুক্ত করা হয়েছে

  // <-- নতুন যুক্ত করা হয়েছে: লগআউট সাকসেস টোস্ট দেখানোর জন্য
  useEffect(() => {
    const isLoggedOut = searchParams.get("loggedOut");
    if (isLoggedOut === "true") {
      toast.success("Successfully logged out!");
      router.replace("/"); // ইউআরএল ক্লিন করা হলো যাতে রিফ্রেশ করলে টোস্ট আবার না আসে
    }
  }, [searchParams, router]);

  const navItems = [
    { href: "#", label: "Consultation" },
    { href: "#", label: "Health Plans" },
    { href: "#", label: "Medicine" },
    { href: "#", label: "Diagnostics" },
    { href: "#", label: "NGOs" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur dark:bg-background/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">PH Doc</span>
        </Link>

        <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* <-- নতুন যুক্ত করা হয়েছে: ডেস্কটপ ভিউতে লগইন বা লগআউট বাটন প্রদর্শন */}
        <div className="hidden items-center space-x-2 md:flex">
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="text-lg font-medium">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-2 rounded-lg shadow transition-all duration-300 transform active:scale-95 border-none">
                Login
              </Button>
            </Link>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" type="button" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[85vw] max-w-sm sm:w-[380px]">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col space-y-4">
              {navItems.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-foreground"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* <-- নতুন যুক্ত করা হয়েছে: মোবাইল ভিউতে লগইন বা লগআউট বাটন প্রদর্শন */}
              {isLoggedIn ? (
                <LogoutButton />
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 rounded-lg shadow transition-all duration-300 transform active:scale-[0.98] border-none">
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default PublicNavbar;