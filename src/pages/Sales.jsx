import { useRef, useState } from "react";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { useCreateSales } from "../features/sales/useCreateSales";
import { useUpdateSales } from "../features/sales/useUpdateSales";
import { useDeleteSales } from "../features/sales/useDeleteSales";
import useSales from "../features/sales/useSales";
import EnableDisableDeleteButtons from "../components/EnableDisableDeleteButtons";
import InputCard from "../components/InputCard";
import InputForm from "../components/InputForm";
import Grid from "../components/Grid";
import useInventory from "../features/inventory/useInventory";
import RevertButton from "../components/RevertButton";
import { useProducts } from "../features/products/useProducts";
import { useRevertSales } from "../features/sales/useRevertSales";

// Designate the field names for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, editable: false },
  {
    field: "date",
    headerName: "Date",
    width: 130,
    editable: false,
  },
  { field: "productId", headerName: "Product ID", width: 130, editable: true },
  {
    field: "inventoryId",
    headerName: "Inventory ID",
    width: 130,
    editable: true,
  },
  { field: "product", headerName: "Product", width: 130, editable: true },
  { field: "quantity", headerName: "Quantity", width: 130, editable: true },
  { field: "price", headerName: "Price", width: 130, editable: true },
  { field: "cost", headerName: "Cost", width: 130, editable: true },
  {
    field: "totalPrice",
    headerName: "Total price",
    width: 130,
    editable: true,
  },
  {
    field: "totalCost",
    headerName: "Total cost",
    width: 130,
    editable: true,
  },
  {
    field: "grossProfit",
    headerName: "Gross profit",
    width: 130,
    editable: true,
  },
  {
    field: "netProfit",
    headerName: "Net profit",
    width: 130,
    editable: true,
  },
];

const mandatoryFields = ["inventoryId", "sellPrice", "quantity", "date"];

// disable fields that are just for display
const disabledFields = ["product", "price", "cost", "quantity"];
const displayFields = ["product", "price", "cost", "quantity"];

function Sales() {
  // State variables for controlled elements
  const [selected, setSelected] = useState();
  const [aggregate, setAggregate] = useState(false);
  const [aggregateField, setAggregateField] = useState("");

  // ref for the grid
  const gridRef = useRef();

  // Get the mutation functions from custom hooks
  const { createSales, isCreating } = useCreateSales();
  const { deleteSales, isDeleting } = useDeleteSales();
  const { updateSales, isUpdating } = useUpdateSales();
  const { revertSales, isReverting } = useRevertSales();

  // Get the query function to get all products from custom hook
  const { sales: rows, isLoading: isLoadingSales } = useSales();

  // Get the inventory and product list to send it as a prop for the product input ("restricted selection") and display fields
  const { inventory, isLoading: isLoadingInventory } = useInventory();
  const { products, isLoading: isLoadingProducts } = useProducts();

  // Make an improvised table join to insert the product price into the inventory table
  const joinTable = inventory?.map((inventoryRow) => {
    return {
      ...inventoryRow,
      price: products?.find(
        (product) => product?.id === inventoryRow?.productId
      )?.price,
    };
  });

  const options = inventory
    ?.filter(
      (inventory) => inventory.active === "Yes" && inventory.quantity > 0
    )
    .map((inventory) => String(inventory.id));

  // Designate the input fields (inside the React Function because we need the inventory list for the options)
  const inputFields = [
    {
      field: "inventoryId",
      label: "Inventory ID",
      icon: "SellIcon",
      type: "text",
      options,
    },
    {
      field: "product",
      label: "Product",
      icon: "SellIcon",
      type: "text",
    },
    {
      field: "price",
      label: "Reference price",
      icon: "AttachMoneyIcon",
      type: "text",
    },
    {
      field: "sellPrice",
      label: "Sell price",
      icon: "AttachMoneyIcon",
      type: "text",
    },
    {
      field: "cost",
      label: "Cost",
      icon: "AttachMoneyIcon",
      type: "text",
    },
    {
      field: "quantity",
      label: "Available quantity",
      icon: "NumbersIcon",
      type: "text",
    },
    {
      field: "sellQuantity",
      label: "Sell quantity",
      icon: "NumbersIcon",
      type: "text",
    },
    {
      field: "date",
      label: "Date",
      icon: "NumbersIcon",
      type: "date",
    },
  ];

  if (isLoadingSales) return <Loader />;
  return (
    <>
      <Header>Sales</Header>
      <div className="p-4">
        <div style={{ width: "100%" }}>
          <Grid
            rows={rows}
            columns={columns}
            setSelected={setSelected}
            handlerApi={updateSales}
            gridRef={gridRef}
            aggregateField={aggregateField}
          />
        </div>
        {selected?.length > 0 && (
          <div className="py-2 flex gap-2">
            <RevertButton
              handlerRevertApi={revertSales}
              selected={selected}
              setSelected={setSelected}
              gridRef={gridRef}
            />
          </div>
        )}

        <InputCard title={"Add to sales"}>
          <InputForm
            handlerCreateApi={createSales}
            inputFields={inputFields}
            mandatoryFields={mandatoryFields}
            disabledFields={disabledFields}
            displayFields={displayFields}
            tableData={joinTable}
          />
        </InputCard>
      </div>
    </>
  );
}

export default Sales;
