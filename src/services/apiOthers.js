import { sub } from "date-fns";
import { inventoryData } from "../test-data/inventoryData";
import { productsData } from "../test-data/productsData";
import { salesData } from "../test-data/salesData";
import { getInventory, updateInventory } from "./apiInventory";
import { getProducts } from "./apiProducts";
import supabase from "./supabase";

// UPLOAD TEST DATA
export const uploadTestData = async function () {
  console.log("deleting...");
  // delete existing data
  const { error1 } = await supabase.from("products").delete().neq("id", 0);
  const { error2 } = await supabase.from("inventory").delete().neq("id", 0);
  const { error3 } = await supabase.from("sales").delete().neq("id", 0);
  console.log("all data deleted");

  // get the test data
  const testProductsData = productsData;
  const testInventoryData = inventoryData;
  const testSalesData = salesData;

  // 1. UPLOAD PRODUCTS
  let testProductsDataArr = [];
  for (const testRow of testProductsData) {
    // delete unnecesary fields
    delete testRow.id;
    delete testRow.created_at;
    // add to array
    testProductsDataArr = [...testProductsDataArr, testRow];
  }

  const { error: errorProducts } = await supabase
    .from("products")
    .insert(testProductsDataArr)
    .select();
  if (errorProducts) throw new Error(errorProducts.message);

  // 2. UPLOAD INVENTORY
  const allProducts = await getProducts();
  let testInventoryDataArr = [];
  for (const testRow of testInventoryData) {
    // assign this sale to the first coincidence with this product-inventory
    const thisProduct = allProducts.find(
      (product) => product.product === testRow.product
    );
    testRow.productId = thisProduct.id;

    // delete unnecesary fields
    delete testRow.id;
    delete testRow.created_at;
    delete testRow.expiration;
    // add to array
    testInventoryDataArr = [...testInventoryDataArr, testRow];
  }

  const { error: errorInventory } = await supabase
    .from("inventory")
    .insert(testInventoryDataArr)
    .select();
  if (errorInventory) throw new Error(errorInventory.message);

  // 3. UPLOAD SALES
  // get data of all inventory rows to find out more about what we are about to upload
  const allInventory = await getInventory();

  let testSalesDataArr = [];

  for (const [index, testRow] of testSalesData.entries()) {
    // assign this sale to the first coincidence with this product-inventory
    const thisInventory = allInventory.find(
      (inventory) => inventory.product === testRow.product
    );
    testRow.inventoryId = thisInventory.id;
    testRow.productId = thisInventory.productId;
    // set date
    // ensure a specific distribution to have sales for each interesting time period (1,7,30,90,365 days)
    testRow.date = sub(new Date(), {
      days:
        index < 10
          ? 1
          : index < 50
          ? Math.ceil(Math.random() * 7)
          : index < 100
          ? Math.ceil(Math.random() * 30)
          : index < 200
          ? Math.ceil(Math.random() * 90)
          : Math.ceil(Math.random() * 365),
    });
    // delete unnecesary fields
    delete testRow.id;
    delete testRow.created_at;
    // add to array
    testSalesDataArr = [...testSalesDataArr, testRow];
  }

  const { error: errorSales } = await supabase
    .from("sales")
    .insert(testSalesDataArr)
    .select();
  if (errorSales) throw new Error(errorSales.message);
};
