import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSales as updateSalesApi } from "../../services/apiSales";
import { toast } from "react-hot-toast";

export function useUpdateSales() {
  const queryClient = useQueryClient();
  const { mutate: updateSales, isLoading: isUpdating } = useMutation({
    mutationFn: (sales) => updateSalesApi(sales),
    onSuccess: () => toast.success("sales updated"),
    onError: () => toast.error("unable to update the product"),
  });
  queryClient.invalidateQueries();
  return { updateSales, isUpdating };
}
