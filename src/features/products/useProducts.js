import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../services/apiProducts";

export function useProducts() {
  const { data, isLoading } = useQuery({
    queryFn: getProducts,
    queryKey: ["products"],
  });
  const products = data?.map((product) =>
    product.active === true
      ? { ...product, active: "Yes" }
      : { ...product, active: "No" }
  );
  return { products, isLoading };
}
