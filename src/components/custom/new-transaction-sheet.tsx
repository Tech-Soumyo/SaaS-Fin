import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";

import { useNewTransaction } from "@/hooks/features/transactions/use-new-transaction";
import { useCreateTransactions } from "@/hooks/features/transactions/use-create-transaction";
import { useGetCategories } from "@/hooks/features/categories/use-get-categories.hook";
import { useCreateCategory } from "@/hooks/features/categories/use-create-category";

import { useCreateAccount } from "@/hooks/features/accounts/use-create-account";
import { useGetAccounts } from "@/hooks/features/accounts/use-get-accounts.hook";
import { TransactionForm } from "./transactions-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({
  id: true,
  // createdAt: true,
  // updatedAt: true,
});
type FormValues = z.input<typeof formSchema>;
export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();

  const createMutation = useCreateTransactions();

  // Fetch Categories and mapped them fit Categories Select option
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) =>
    categoryMutation.mutate({
      name,
    });
  const categoryOptions = (categoryQuery.data ?? []).map((categories) => ({
    label: categories.name,
    value: categories.id,
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) =>
    accountMutation.mutate({
      name,
    });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    createMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Transaction</SheetTitle>
            <SheetDescription>Add a new transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <TransactionForm
              onSubmit={onSubmit}
              disabled={isPending}
              categoryOptions={categoryOptions}
              onCreateCategory={onCreateCategory}
              accountOptions={accountOptions}
              onCreateAccount={onCreateAccount}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
