import { useQuery } from "@tanstack/react-query";
import { getInventory } from "../../services/apiInventory";
import { formatDate } from "../../utils/helpers";

function useInventory() {
  const { data, isLoading } = useQuery({
    queryFn: getInventory,
    queryKey: ["inventory"],
  });
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  //   console.log(today);
  const inventory = data?.map((inventory) => {
    let auxObj = {};
    // Translate the boolean to a more user friendly string
    auxObj = inventory.active
      ? { ...inventory, active: "Yes" }
      : { ...inventory, active: "No" };

    // Only do this if there is an expiration date
    if (!inventory.expiration) return auxObj;
    const expirationDate = new Date(inventory.expiration);
    expirationDate.setHours(23);
    expirationDate.setMinutes(59);
    expirationDate.setSeconds(59);
    if (expirationDate < today) {
      auxObj = { ...auxObj, expired: "EXPIRED" };
    } else {
      auxObj = { ...auxObj, expired: "" };
    }

    // Translate the date to a more user friendly string
    auxObj = {
      ...auxObj,
      expiration: String(formatDate(new Date(auxObj.expiration))),
    };

    return auxObj;
  });

  return { inventory, isLoading };
}

export default useInventory;
