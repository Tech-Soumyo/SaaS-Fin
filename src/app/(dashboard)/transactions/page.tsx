"use client";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import React, { useState } from "react";

import { useNewTransaction } from "@/hooks/features/transactions/use-new-transaction";
import { useGetTransactions } from "@/hooks/features/transactions/use-get-transactions.hook";
import { useBulkDeleteTransactions } from "@/hooks/features/transactions/use-bulk-delete-transactions";
import { useBulkCreateTransactions } from "@/hooks/features/transactions/use-bulk-create-transactions";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/hooks/features/accounts/use-select-account";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "@/app/(dashboard)/transactions/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadButton } from "./upLoad.button";
import { ImportCard } from "@/app/(dashboard)/transactions/import-card";

// eslint-disable-next-line no-unused-vars
enum VARIANTS {
  // eslint-disable-next-line no-unused-vars
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {}, // will be used by a package
};

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);
  const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
    setImportResults(results);
    setVariant(VARIANTS.IMPORT);
  };
  const onCancelImport = () => {
    setImportResults(INITIAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  };

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  // fetch transactions data
  const transactionsQuery = useGetTransactions();
  const transactions = transactionsQuery.data || [];

  const isDisabled =
    transactionsQuery.isLoading || deleteTransactions.isPending;

  const onSubmitImport = async (
    values: (typeof transactionSchema.$inferInsert)[]
  ) => {
    const accountId = await confirm();
    if (!accountId) {
      return toast.error("Please select and account to continue.");
    }
    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));
    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      },
    });
  };

  if (transactionsQuery.isLoading) {
    return (
      <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex h-[500px] w-full items-center justify-center">
              <Loader2 className="size-6 animate-spin text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    );
  }
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Transaction History
          </CardTitle>
          <div className="flex flex-col items-center gap-2 lg:flex-row">
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="mr-2 size-4" />
              Add New
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>

        {/* Transactions Data Table */}
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
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
