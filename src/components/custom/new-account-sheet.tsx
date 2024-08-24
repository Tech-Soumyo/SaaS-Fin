import { useNewAccount } from "../../hooks/features/accounts/use-new-account";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AccountForm } from "./account-form";
import { insertAccountsSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../../hooks/features/accounts/use-create-account";

const formSchema = insertAccountsSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;
export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount();

  const mutation = useCreateAccount();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Account</SheetTitle>
            <SheetDescription>
              Create New Account to Track your Transactions
            </SheetDescription>
          </SheetHeader>
          <AccountForm
            onSubmit={onSubmit}
            disabled={mutation.isPending}
            defaultValues={{
              name: "",
            }}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
