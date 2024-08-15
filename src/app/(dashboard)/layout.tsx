import { Header } from "@/components/custom/Header";
import React from "react";

type props = {
  children: React.ReactNode;
};

function layout({ children }: props) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
}

export default layout;
