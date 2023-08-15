import { useEffect, useRef, useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import useInventory from "../features/inventory/useInventory";
import { useCreateInventory } from "../features/inventory/useCreateInventory";
import { useDeleteInventory } from "../features/inventory/useDeleteInventory";
import { useUpdateInventory } from "../features/inventory/useUpdateInventory";

import Header from "../components/Header";
import Grid from "../components/Grid";
import EnableDisableDeleteButtons from "../components/EnableDisableDeleteButtons";
import InputForm from "../components/InputForm";
import Loader from "../components/Loader";
import LoaderMini from "../components/LoaderMini";
import InputCard from "../components/InputCard";
import { useProducts } from "../features/products/useProducts";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";

// Designate the field names for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, editable: false },
  { field: "productId", headerName: "Product ID", width: 130, editable: true },
  { field: "product", headerName: "Product", width: 130, editable: true },
  { field: "quantity", headerName: "Quantity", width: 130, editable: true },
  { field: "cost", headerName: "Cost", width: 130, editable: true },
  { field: "totalCost", headerName: "Total cost", width: 130, editable: true },
  {
    field: "expiration",
    headerName: "Expiration",
    width: 130,
    editable: false,
  },
  {
    field: "expired",
    headerName: "Expired",
    width: 130,
    editable: false,
  },
  { field: "active", headerName: "Active", width: 130, editable: false },
];

const mandatoryFields = ["product", "cost", "quantity"];

function Inventory() {
  // State variables for controlled elements
  const [selected, setSelected] = useState();
  const [aggregateField, setAggregateField] = useState("");
  const [aggregate, setAggregate] = useState(false);
  const [filterZeroRows, setFilterZeroRows] = useState(false);

  // ref for the grid
  const gridRef = useRef();

  // Get the mutation functions from custom hooks
  const { createInventory, isCreating } = useCreateInventory();
  const { deleteInventory, isDeleting } = useDeleteInventory();
  const { updateInventory, isUpdating } = useUpdateInventory();

  // Get the query function to get all products from custom hook
  const { inventory: rows, isLoading: isLoadingInventory } = useInventory();

  // Get the products list to send it as a prop for the product input ("restricted selection")
  const { products, isLoading: isLoadingProducts } = useProducts();
  const options = products
    ?.filter((product) => product.active === "Yes")
    .map((product) => product.product);

  // Designate the input fields (inside the React Function because we need the products list for the options)
  const inputFields = [
    {
      field: "product",
      label: "Product name",
      icon: "SellIcon",
      type: "text",
      options,
    },
    {
      field: "quantity",
      label: "Quantity",
      icon: "NumbersIcon",
      type: "text",
    },
    {
      field: "cost",
      label: "Cost",
      icon: "AttachMoneyIcon",
      type: "text",
    },
    {
      field: "expiration",
      label: "Expiration date",
      icon: "CalendarMonthIcon",
      type: "date",
    },
  ];

  // aggregate by product
  const label = { inputProps: { "aria-label": "aggregate by product" } };
  function handleAggregateByProduct() {
    // toggle the aggregate state and field
    setAggregate((aggregate) => !aggregate);
    setAggregateField((aggregateField) =>
      aggregateField === "" ? "product" : ""
    );
    // force no-zero rows
  }

  // no zero-stock rows
  const label2 = { inputProps: { "aria-label": "no zero stock rows" } };
  function handleNoZeroRows() {
    setFilterZeroRows((filterZeroRows) => !filterZeroRows);
  }

  // keep aggregate and no-zero filter in sync
  useEffect(
    function () {
      setFilterZeroRows((filterZeroRows) => (aggregate ? true : false));
    },
    [aggregate]
  );

  if (isLoadingInventory) return <Loader />;
  return (
    <>
      <Header>Inventory</Header>
      <div className="p-4">
        <div style={{ width: "100%" }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  {...label}
                  checked={aggregate}
                  onChange={handleAggregateByProduct}
                />
              }
              label="Aggregate by product"
            />
            <FormControlLabel
              control={
                <Switch
                  {...label2}
                  checked={filterZeroRows}
                  onChange={handleNoZeroRows}
                  disabled={aggregate}
                />
              }
              label="No zero stock rows"
            />
          </FormGroup>
          <Grid
            rows={rows}
            columns={columns}
            setSelected={setSelected}
            handlerApi={updateInventory}
            gridRef={gridRef}
            aggregateField={aggregateField}
            noZeroRows={filterZeroRows}
          />
        </div>
        {selected?.length > 0 && !aggregate && (
          <div className="py-2 flex gap-2">
            <EnableDisableDeleteButtons
              handlerUpdateApi={updateInventory}
              handlerDeleteApi={deleteInventory}
              selected={selected}
              setSelected={setSelected}
              gridRef={gridRef}
            />
          </div>
        )}

        <InputCard title={"Add to inventory"}>
          <InputForm
            handlerCreateApi={createInventory}
            inputFields={inputFields}
            mandatoryFields={mandatoryFields}
          />
        </InputCard>
      </div>
    </>
  );
}

export default Inventory;
