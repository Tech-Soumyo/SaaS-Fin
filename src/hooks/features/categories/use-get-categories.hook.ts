import { client } from "@/lib/hono-RPC";
import { useQuery } from "@tanstack/react-query";

export const useGetCategories = () => {
  const Query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }

      const { data } = await response.json();
      return data;
    },
  });
  return Query;
};
