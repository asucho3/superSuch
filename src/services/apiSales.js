import { createInventory, getInventory, updateInventory } from "./apiInventory";
import { getProducts } from "./apiProducts";
import supabase from "./supabase";

// SELECT *
export const getSales = async function () {
  let { data: sales, error } = await supabase.from("sales").select("*");
  if (error) throw new Error(error.message);
  return sales;
};

// CREATE
export const createSales = async function (salesData) {
  // tidy up the data (eliminate reference data)
  salesData.quantity = salesData.sellQuantity;
  delete salesData.sellQuantity;
  salesData.price = salesData.sellPrice;
  delete salesData.sellPrice;

  // get data of all inventory rows to find out more about what we are about to upload
  const allInventory = await getInventory();
  const thisInventory = allInventory.find(
    (inventory) => Number(inventory.id) === Number(salesData.inventoryId)
  );

  // get data of all product to find out more about what we are about to upload
  const allProducts = await getProducts();
  const thisProduct = allProducts.find(
    (product) => Number(product.id) === Number(thisInventory.productId)
  );

  if (!thisProduct || !thisInventory)
    throw new Error("This row or product does not exist");

  if (thisInventory.quantity < salesData.quantity) {
    throw new Error("Not enough stock for this sale");
  }

  // calculate the sales data
  salesData.price = salesData.price ? salesData.price : thisProduct.price;
  salesData.cost = salesData.cost ? salesData.cost : thisInventory.cost;
  salesData.product = thisProduct.product;
  salesData.totalPrice = salesData.price
    ? salesData.price * salesData.quantity
    : thisProduct.price * salesData.quantity;
  salesData.totalCost = salesData.cost
    ? salesData.cost * salesData.quantity
    : thisInventory.cost * salesData.quantity;
  salesData.grossProfit = salesData.totalPrice - salesData.totalCost;
  salesData.netProfit = salesData.grossProfit * 0.65;
  salesData.productId = thisProduct.id;
  salesData.inventoryId = thisInventory.id;

  // update the inventory stock
  await updateInventory({
    ...thisInventory,
    quantity: thisInventory.quantity - salesData.quantity,
  });

  const { data: newProduct, error } = await supabase
    .from("sales")
    .insert([{ ...salesData }])
    .select();
  if (error) throw new Error(error.message);
  return newProduct;
};

// UPDATE
export const updateSales = async function (sales) {
  // remove accesory fields that don't exist in the server or shouldn't be updated
  delete sales.expiration;
  delete sales.expired;

  if (!Array.isArray(sales)) {
    sales = Array.from({ length: 1 }, () => sales);
  }

  for (const product of sales) {
    const { data, error } = await supabase
      .from("sales")
      .update({ ...product })
      .eq("id", product.id)
      .select();
    if (error) throw new Error(error.message);
  }
};

// DELETE
export const deleteSales = async function (sales) {
  let error = "";
  for (const product of sales) {
    ({ error } = await supabase.from("sales").delete().eq("id", product));
  }
  if (error) throw new Error(error.message);
};

// REVERT
export const revertSales = async function (sales) {
  // get data of sales
  const allSales = await getSales();

  // get data of inventory
  const allInventory = await getInventory();

  for (const sale of sales) {
    const thisSale = allSales.find((element) => element.id === sale);
    if (!thisSale) throw new Error("could not find a sale");
    const thisInventory = allInventory.find(
      (element) => element.id === thisSale.inventoryId
    );

    await updateInventory({
      ...thisInventory,
      quantity: thisInventory.quantity + thisSale.quantity,
    });
  }
  await deleteSales(sales);
};
