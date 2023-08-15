import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { uploadTestData } from "../services/apiOthers";

export function useCreateTestData() {
  const queryClient = useQueryClient();
  const { mutate: createTestData, isLoading: isCreating } = useMutation({
    mutationFn: uploadTestData,
    onSuccess: () => toast.success("test data uploaded"),
    onError: () => toast.error("unable to create the test data"),
  });
  queryClient.invalidateQueries();
  return { createTestData, isCreating };
}
