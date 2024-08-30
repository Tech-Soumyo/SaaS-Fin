import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono-RPC";

type ResponseType = InferResponseType<
  (typeof client.api.transactions)[":id"]["$delete"]
>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("ID is required to delete the transaction.");
      }

      const response = await client.api.transactions[":id"]["$delete"]({
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
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      //   TODO: Invalidate Summary
    },
    onError: (error) => {
      console.error("Failed to delete transaction:", error.message);
      toast.error(`Failed to Delete transaction: ${error.message}`);
    },
  });

  return mutation;
};
