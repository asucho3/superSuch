import { inventoryData } from "../../test-data/inventoryData";
import { getProducts } from "./apiProducts";
import supabase from "./supabase";

// SELECT *
export const getInventory = async function () {
  let { data: inventory, error } = await supabase.from("inventory").select("*");
  // .gt("quantity", 0);
  if (error) throw new Error(error.message);
  return inventory;
};

// CREATE
export const createInventory = async function (productData) {
  // get data of all product to find out more about what we are about to upload
  const allProducts = await getProducts();
  const thisProduct = allProducts.find(
    (product) => product.product === productData.product
  );

  // calculate properties before uploading
  productData.productId = thisProduct.id;
  productData.totalCost = productData.quantity * productData.cost;

  const { data: newProduct, error } = await supabase
    .from("inventory")
    .insert([{ ...productData }])
    .select();
  if (error) throw new Error(error.message);
  return newProduct;
};

// UPDATE
export const updateInventory = async function (inventory) {
  // remove accesory fields that don't exist in the server or shouldn't be updated
  delete inventory.expiration;
  delete inventory.expired;

  if (!Array.isArray(inventory)) {
    inventory = Array.from({ length: 1 }, () => inventory);
  }

  for (const row of inventory) {
    // recalculate properties before uploading
    row.totalCost = row.quantity * row.cost;
    const { data, error } = await supabase
      .from("inventory")
      .update({ ...row })
      .eq("id", row.id)
      .select();
    if (error) throw new Error(error.message);
  }
};

// DELETE
export const deleteInventory = async function (inventory) {
  let error = "";
  for (const product of inventory) {
    ({ error } = await supabase.from("inventory").delete().eq("id", product));
  }
  if (error) throw new Error(error.message);
};
