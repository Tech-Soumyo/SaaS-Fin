"use client";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono-RPC";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Actions from "./actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

export type ResponseType = InferResponseType<
  typeof client.api.categories.$get,
  200
>["data"][0];

export const columns: ColumnDef<ResponseType>[] = [
  {
    // Selection column
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    // Email column with sorting functionality
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "Actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
  },
];
