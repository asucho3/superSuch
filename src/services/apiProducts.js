import supabase from "./supabase";

// SELECT *
export const getProducts = async function () {
  let { data: products, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return products;
};

// CREATE
export const createProduct = async function (productData) {
  const { data: newProduct, error } = await supabase
    .from("products")
    .insert([{ product: productData.product, price: productData.price }])
    .select();
  if (error) throw new Error(error.message);
  return newProduct;
};

// UPDATE
export const updateProducts = async function (products) {
  if (!Array.isArray(products)) {
    products = Array.from({ length: 1 }, () => products);
  }
  console.log(products);
  for (const product of products) {
    const { data, error } = await supabase
      .from("products")
      .update({ ...product })
      .eq("id", product.id)
      .select();
    if (error) throw new Error(error.message);
  }
};

// DELETE
export const deleteProducts = async function (products) {
  let error = "";
  for (const product of products) {
    ({ error } = await supabase.from("products").delete().eq("id", product));
  }
  if (error) throw new Error(error.message);
};
