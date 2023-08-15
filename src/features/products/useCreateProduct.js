import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct as createProductApi } from "../../services/apiProducts";
import { toast } from "react-hot-toast";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { mutate: createProduct, isLoading: isCreating } = useMutation({
    mutationFn: (product) => createProductApi(product),
    onSuccess: () => toast.success("product created"),
    onError: () => toast.error("unable to create the product"),
  });
  queryClient.invalidateQueries();
  return { createProduct, isCreating };
}
