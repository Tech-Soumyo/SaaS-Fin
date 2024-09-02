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

import { Loader2, Plus } from "lucide-react";
import { columns } from "@/app/(dashboard)/transactions/columns";
import { DataTable } from "@/components/ui/data-table";

import { Skeleton } from "@/components/ui/skeleton";

import { useNewCategory } from "@/hooks/features/categories/use-new-categories";
import { useGetCategories } from "@/hooks/features/categories/use-get-categories.hook";
import { useBulkDeleteCategories } from "@/hooks/features/categories/use-bulk-delete-categories";
import { useNewTransaction } from "@/hooks/features/transactions/use-new-transaction";
import { useGetTransaction } from "@/hooks/features/transactions/use-get-transaction";
import { useGetTransactions } from "@/hooks/features/transactions/use-get-transactions.hook";
import { useBulkDeleteTransactions } from "@/hooks/features/transactions/use-bulk-delete-transactions";
import { transactions } from "@/db/schema";

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

const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const transactionsQuery = useGetTransactions();
  const transaction = transactionsQuery.data || [];

  const deleteTransactions = useBulkDeleteTransactions();
  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  if (transactionsQuery.isLoading) {
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
            Transaction Page
          </CardTitle>
          <Button onClick={newTransaction.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transaction}
            filterKey="name"
            onDelete={(row) => {
              const ids = row
                .map((r) => r.original.id)
                .filter((id): id is string => id !== null);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
