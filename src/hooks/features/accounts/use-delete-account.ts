import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono-RPC";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)[":id"]["$delete"]
>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("ID is required to delete the account.");
      }

      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });

      const result = await response.json();

      if (!response.ok) {
        const error = (result as { error: string }).error || "Unknown error";
        throw new Error(error);
      }

      return result as { data: { id: string } };
    },
    onSuccess: () => {
      toast.success("Account Deleted");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      console.error("Failed to delete account:", error.message);
      toast.error(`Failed to Delete account: ${error.message}`);
    },
  });

  return mutation;
};
