import { useQuery } from "@tanstack/react-query";
import { getSales } from "../../services/apiSales";
import { formatDate } from "../../utils/helpers";

function useSales() {
  const { data: sales, isLoading } = useQuery({
    queryFn: getSales,
    queryKey: ["sales"],
  });
  return { sales, isLoading };
}

export default useSales;
