"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { NavButton } from "./NavButton";
import { useMedia } from "react-use";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
const route = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

function Navigation() {
  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const pathName = usePathname();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setOpen}>
          <SheetTrigger>
            <Button
              variant="outline"
              size="sm"
              className="font-normal bg-white/10  hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-2">
            <nav className="flex flex-col gap-y-2 pt-6">
              {route.map((route) => (
                <Button
                  key={route.href}
                  variant={route.href === pathName ? "secondary" : "ghost"}
                  onClick={() => onClick(route.href)}
                  className="w-full justify-start"
                >
                  {route.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </>
    );
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {route.map((route) => (
        <NavButton
          key={route.href}
          href={route.href}
          label={route.label}
          isActive={pathName === route.href}
        />
      ))}
    </nav>
  );
}

export default Navigation;
