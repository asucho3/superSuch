import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInventory as createInventoryApi } from "../../services/apiInventory";
import { toast } from "react-hot-toast";

export function useCreateInventory() {
  const queryClient = useQueryClient();
  const { mutate: createInventory, isLoading: isCreating } = useMutation({
    mutationFn: (inventory) => createInventoryApi(inventory),
    onSuccess: () => toast.success("inventory created"),
    onError: () => toast.error("unable to create the inventory"),
  });
  queryClient.invalidateQueries();
  return { createInventory, isCreating };
}
