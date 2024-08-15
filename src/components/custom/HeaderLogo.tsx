import Image from "next/image";
import Link from "next/link";
import React from "react";

function HeaderLogo() {
  return (
    <>
      <Link href="/">
        <div className="items-center hidden lg:flex">
          <Image src="/logo.svg" alt="logo" height={28} width={28} />
          <p className="font-semibold text-white text-2xll ml-2.5 ">
            Finance Platform
          </p>
        </div>
      </Link>
    </>
  );
}

export default HeaderLogo;
