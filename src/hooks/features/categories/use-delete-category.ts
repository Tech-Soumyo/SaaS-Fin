import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono-RPC";

type ResponseType = InferResponseType<
  (typeof client.api.categories)[":id"]["$delete"]
>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      if (!id) {
        throw new Error("ID is required to delete the Category.");
      }

      const response = await client.api.categories[":id"]["$delete"]({
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
      toast.success("Category Deleted");
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      //   TODO: Invalidate Summary and transactions
    },
    onError: (error) => {
      console.error("Failed to delete category:", error.message);
      toast.error(`Failed to Delete category: ${error.message}`);
    },
  });

  return mutation;
};
