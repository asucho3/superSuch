import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSales as createSalesApi } from "../../services/apiSales";
import { toast } from "react-hot-toast";

export function useCreateSales() {
  const queryClient = useQueryClient();
  const { mutate: createSales, isLoading: isCreating } = useMutation({
    mutationFn: (sales) => createSalesApi(sales),
    onSuccess: () => toast.success("sales created"),
    onError: () => toast.error("unable to create the sales"),
  });
  queryClient.invalidateQueries();
  return { createSales, isCreating };
}
