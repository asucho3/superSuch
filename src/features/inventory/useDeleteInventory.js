import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInventory as deleteInventoryApi } from "../../services/apiInventory";
import { toast } from "react-hot-toast";

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  const { mutate: deleteInventory, isLoading: isDeleting } = useMutation({
    mutationFn: (inventory) => deleteInventoryApi(inventory),
    onSuccess: () => toast.success("inventory deleted"),
    onError: () => toast.error("unable to delete the inventory"),
  });
  queryClient.invalidateQueries();
  return { deleteInventory, isDeleting };
}
