import { client } from "@/lib/hono-RPC";
import { useQuery } from "@tanstack/react-query";

export const useGetAccounts = () => {
  const Query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch account");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return Query;
};
