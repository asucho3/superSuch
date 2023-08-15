import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSales as deleteSalesApi } from "../../services/apiSales";
import { toast } from "react-hot-toast";

export function useDeleteSales() {
  const queryClient = useQueryClient();
  const { mutate: deleteSales, isLoading: isDeleting } = useMutation({
    mutationFn: (sales) => deleteSalesApi(sales),
    onSuccess: () => toast.success("sales deleted"),
    onError: () => toast.error("unable to delete the sales"),
  });
  queryClient.invalidateQueries();
  return { deleteSales, isDeleting };
}
