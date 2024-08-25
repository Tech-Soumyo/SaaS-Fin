"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNewAccount } from "../../../hooks/features/accounts/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/accounts/columns";
import { DataTable } from "@/components/ui/data-table";
import { useGetAccounts } from "@/hooks/features/accounts/use-get-accounts.hook";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/hooks/features/accounts/use-bulk-delete-accounts";

// export default function AccountPage() {
//   return (
//     <>
//       <div>Account Page</div>
//     </>
//   );
// }

// const data: Payment[] = [
//   {
//     id: "728ed52f",
//     amount: 100,
//     status: "pending",
//     email: "m@example.com",
//   },
//   {
//     id: "728ed54s",
//     amount: 50,
//     status: "success",
//     email: "a@example.com",
//   },
// ];

const AccountPage = () => {
  const newAccount = useNewAccount();
  const accountsQuery = useGetAccounts();
  const accounts = accountsQuery.data || [];

  const deleteAccounts = useBulkDeleteAccounts();
  const isDisabled = accountsQuery.isLoading || deleteAccounts.isPending;

  if (accountsQuery.isLoading) {
    return (
      <>
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader>
              <Skeleton className="h-8 w-full" />
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-sping" />
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1 md:justify-center">
            Account Page
          </CardTitle>
          <Button onClick={newAccount.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add Account
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={accounts}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteAccounts.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
