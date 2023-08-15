import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProducts as deleteProductsApi } from "../../services/apiProducts";
import { toast } from "react-hot-toast";

export function useDeleteProducts() {
  const queryClient = useQueryClient();
  const { mutate: deleteProducts, isLoading: isDeleting } = useMutation({
    mutationFn: (product) => deleteProductsApi(product),
    onSuccess: () => toast.success("products deleted"),
    onError: () => toast.error("unable to delete the product"),
  });
  queryClient.invalidateQueries();
  return { deleteProducts, isDeleting };
}
