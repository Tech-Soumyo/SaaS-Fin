"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteAccount } from "@/hooks/features/accounts/use-delete-account";
import useConfirm from "@/hooks/use-confirm";
import { useOpenAccount } from "@/hooks/use-open-account";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";

type Props = {
  id: string;
};

function Actions({ id }: Props) {
  const { onOpen } = useOpenAccount();
  const deleteMutation = useDeleteAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure? You want to delete this account ?",
    "You are about to delete this account."
  );

  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={false} onClick={() => onOpen(id)}>
            <Edit2 className="size-5 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem disabled={false} onClick={() => handleDelete()}>
            <Trash2 className="size-5 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default Actions;
