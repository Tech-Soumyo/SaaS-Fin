"use client";
// import { useGetAccounts } from "@/features-hooks/accounts/api/use-get-accounts.hook";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "../../hooks/features/accounts/use-new-account";
import React from "react";

export default function Home() {
  const { onOpen } = useNewAccount();
  // const { data: accounts, isLoading } = useGetAccounts();
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  return (
    <>
      <Button onClick={onOpen}>Add An Account</Button>
      {/* <div>
        {accounts?.map((account) => (
          <div key={account.id}>{account.name}</div>
        ))}
      </div> */}
      <div>Dashboard</div>
    </>
  );
}
