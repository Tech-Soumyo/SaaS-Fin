// import { toast } from "sonner";
// import { InferRequestType, InferResponseType } from "hono";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import { client } from "@/lib/hono-RPC";

// type ResponseType = InferResponseType<
//   (typeof client.api.accounts)["bulk-delete"]["$post"]
// >;
// type RequestType = InferRequestType<
//   (typeof client.api.accounts)["bulk-delete"]["$post"]
// >["json"];

// export const useBulkDeleteAccounts = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation<ResponseType, Error, RequestType>({
//     mutationFn: async (json) => {
//       const response = await client.api.accounts["bulk-delete"]["$post"]({
//         json,
//       });
//       return await response.json();
//     },
//     onSuccess: () => {
//       toast.success("Account Deleted");
//       queryClient.invalidateQueries({ queryKey: ["accounts"] });
//       //   TODO: Also Validate Summary
//     },
//     onError: () => {
//       toast.error("Failed to Delete account");
//     },
//   });

//   return mutation;
// };
import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono-RPC";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts["bulk-delete"]["$post"]({
        json,
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TODO: Also invalidate summary
    },
    onError: () => {
      toast.error("Failed to delete account");
    },
  });

  return mutation;
};
