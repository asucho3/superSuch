import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProducts as updateProductsApi } from "../../services/apiProducts";
import { toast } from "react-hot-toast";

export function useUpdateProducts() {
  const queryClient = useQueryClient();
  const { mutate: updateProducts, isLoading: isUpdating } = useMutation({
    mutationFn: (product) => updateProductsApi(product),
    onSuccess: () => toast.success("products updated"),
    onError: () => toast.error("unable to update the product"),
  });
  queryClient.invalidateQueries();
  return { updateProducts, isUpdating };
}
