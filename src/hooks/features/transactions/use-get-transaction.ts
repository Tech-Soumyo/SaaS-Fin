import { client } from "@/lib/hono-RPC";
import { convertamountFromMiliUnits } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      if (!id) throw new Error("Transaction ID is required");

      // Perform the API request
      const response = await client.api.transactions[":id"].$get({
        param: { id },
      });

      // Check if response is okay
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `Failed to fetch Transaction: ${response.status} ${errorMessage}`
        );
      }

      // Safely parse JSON response
      let result;
      try {
        result = await response.json(); // response should have a structure like { data: {...} }
      } catch (error) {
        throw new Error("Failed to parse response JSON");
      }

      // Extract the actual data from the result
      const { data } = result;

      // Handle missing or unexpected data structure
      if (!data || typeof data.amount !== "number") {
        throw new Error("Invalid transaction data received");
      }

      // Return transformed data with converted amount
      return {
        ...data,
        amount: convertamountFromMiliUnits(data.amount),
      };
    },
  });

  return query;
};
