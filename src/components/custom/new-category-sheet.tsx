import { useNewCategory } from "@/hooks/features/categories/use-new-categories";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { insertCategoriesSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategory } from "@/hooks/features/categories/use-create-category";
import { CategoryForm } from "./category-form";

const formSchema = insertCategoriesSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;
export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>New Category</SheetTitle>
            <SheetDescription>
              Create New Category to Track your Transactions
            </SheetDescription>
          </SheetHeader>
          <CategoryForm
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
