import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInventory as updateInventoryApi } from "../../services/apiInventory";
import { toast } from "react-hot-toast";

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  const { mutate: updateInventory, isLoading: isUpdating } = useMutation({
    mutationFn: (inventory) => updateInventoryApi(inventory),
    onSuccess: () => toast.success("inventory updated"),
    onError: () => toast.error("unable to update the product"),
  });
  queryClient.invalidateQueries();
  return { updateInventory, isUpdating };
}
