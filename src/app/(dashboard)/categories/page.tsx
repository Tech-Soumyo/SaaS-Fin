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
import { columns } from "@/app/(dashboard)/categories/columns";
import { DataTable } from "@/components/ui/data-table";

import { Skeleton } from "@/components/ui/skeleton";

import { useNewCategory } from "@/hooks/features/categories/use-new-categories";
import { useGetCategories } from "@/hooks/features/categories/use-get-categories.hook";
import { useBulkDeleteCategories } from "@/hooks/features/categories/use-bulk-delete-categories";

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

const CatagoriesPage = () => {
  const newCategory = useNewCategory();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];

  const deleteCategories = useBulkDeleteCategories();
  const isDisabled = categoriesQuery.isLoading || deleteCategories.isPending;

  if (categoriesQuery.isLoading) {
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
            Catagory Page
          </CardTitle>
          <Button onClick={newCategory.onOpen} size="sm">
            <Plus className="size-4 mr-2" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CatagoriesPage;
