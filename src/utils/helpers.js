import { format } from "date-fns";

export function formatDate(date) {
  const thisDate = new Date(date);
  thisDate.setHours(23);
  thisDate.setMinutes(59);
  thisDate.setSeconds(59);
  return format(thisDate, "MMM dd");
}

export function getMonth(date) {
  const thisDate = new Date(date);
  thisDate.setHours(23);
  thisDate.setMinutes(59);
  thisDate.setSeconds(59);
  return format(thisDate, "MMM-yyyy");
}

export function formatMoney(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}
