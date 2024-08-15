"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { NavButton } from "./NavButton";

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

  const onclick = (href: string) => {
    router.push(href);
    setOpen(false);
  };
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
