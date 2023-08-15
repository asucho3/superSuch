import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revertSales as revertSalesApi } from "../../services/apiSales";
import { toast } from "react-hot-toast";

export function useRevertSales() {
  const queryClient = useQueryClient();
  const { mutate: revertSales, isLoading: isUpdating } = useMutation({
    mutationFn: (sales) => revertSalesApi(sales),
    onSuccess: () => toast.success("sales updated"),
    onError: () => toast.error("unable to update the product"),
  });
  queryClient.invalidateQueries();
  return { revertSales, isUpdating };
}
