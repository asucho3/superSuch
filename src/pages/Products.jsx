import { useRef, useState } from "react";

import { useCreateProduct } from "../features/products/useCreateProduct";
import { useProducts } from "../features/products/useProducts";
import { useDeleteProducts } from "../features/products/useDeleteProducts";
import { useUpdateProducts } from "../features/products/useUpdateProducts";

import Grid from "../components/Grid";
import InputForm from "../components/InputForm";
import InputCard from "../components/InputCard";
import EnableDisableDeleteButtons from "../components/EnableDisableDeleteButtons";
import Header from "../components/Header";
import Loader from "../components/Loader";
import LoaderMini from "../components/LoaderMini";

// Designate the field names for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, editable: false },
  { field: "product", headerName: "Product", width: 130, editable: true },
  { field: "price", headerName: "Price", width: 130, editable: true },
  { field: "active", headerName: "Active", width: 130, editable: false },
];

// Designate the input fields
const inputFields = [
  {
    field: "product",
    label: "Product name",
    icon: "SellIcon",
    type: "text",
  },
  {
    field: "price",
    label: "Price",
    icon: "AttachMoneyIcon",
    type: "text",
  },
];

const mandatoryFields = ["product", "price"];

function Products() {
  // State variables for controlled elements
  const [selected, setSelected] = useState([]);
  const [aggregate, setAggregate] = useState(false);
  const [aggregateField, setAggregateField] = useState("");

  // ref for the grid
  const gridRef = useRef();

  // Get the mutation functions from custom hooks
  const { createProduct, isCreating } = useCreateProduct();
  const { deleteProducts, isDeleting } = useDeleteProducts();
  const { updateProducts, isUpdating } = useUpdateProducts();

  // Get the query function to get all products from custom hook
  const { products: rows, isLoading: isLoadingProducts } = useProducts();

  if (isLoadingProducts) return <Loader />;
  return (
    <>
      <Header>Products</Header>
      <div className="p-4">
        <div style={{ width: "100%" }}>
          <Grid
            rows={rows}
            columns={columns}
            setSelected={setSelected}
            handlerApi={updateProducts}
            gridRef={gridRef}
            aggregateField={aggregateField}
          />
        </div>
        {selected?.length > 0 && (
          <div className="py-2 flex gap-2">
            <EnableDisableDeleteButtons
              handlerUpdateApi={updateProducts}
              handlerDeleteApi={deleteProducts}
              selected={selected}
              setSelected={setSelected}
              gridRef={gridRef}
            />
          </div>
        )}
        <InputCard title={"Add product"}>
          <InputForm
            handlerCreateApi={createProduct}
            inputFields={inputFields}
            mandatoryFields={mandatoryFields}
          />
        </InputCard>
      </div>
    </>
  );
}

export default Products;
