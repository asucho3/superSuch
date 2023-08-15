import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import Header from "../components/Header";
import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useCreateProduct } from "../features/products/useCreateProduct";
import { useProducts } from "../features/products/useProducts";
import Loader from "../components/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import Modal from "../components/Modal";

import { useDeleteProducts } from "../features/products/useDeleteProducts";
import { useUpdateProducts } from "../features/products/useUpdateProducts";

// Designate the field names for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, editable: false },
  { field: "product", headerName: "Product", width: 130, editable: true },
  { field: "price", headerName: "Price", width: 130, editable: true },
  { field: "active", headerName: "Active", width: 130, editable: false },
];

function Products() {
  // State variables for controlled elements
  const [selected, setSelected] = useState();
  const [newProduct, setNewProduct] = useState();
  const [open, setOpen] = useState(false);

  // Get the mutation functions from custom hooks
  const { createProduct, isCreating } = useCreateProduct();
  const { deleteProducts, isDeleting } = useDeleteProducts();
  const { updateProducts, isUpdating } = useUpdateProducts();

  // DataGrid API
  const apiRef = useGridApiRef();

  // helper function to deselect rows from the grid
  function deselectRows() {
    const selectedRows = apiRef.current.getSelectedRows();

    for (const [key, value] of selectedRows.entries()) {
      apiRef.current.selectRow(key, false);
    }

    setSelected();
  }

  // Get the query function to get all products from custom hook
  const { products: rows, isLoading: isLoadingProducts } = useProducts();

  // Event handlers
  function handleResetForm() {
    setNewProduct({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    // guard clause
    if (!newProduct?.product || !newProduct?.price) return;
    createProduct(newProduct, { onSuccess: setNewProduct() });
  }

  function handleEnableProduct() {
    const updatedProducts = selected.map((product) => {
      return { id: product, active: true };
    });
    updateProducts(updatedProducts);
    deselectRows();
  }
  function handleDisableProduct() {
    const updatedProducts = selected.map((product) => {
      return { id: product, active: false };
    });
    updateProducts(updatedProducts);
    deselectRows();
  }
  function handleDeleteProduct() {
    deleteProducts(selected);
    deselectRows();
  }

  // Edit events
  function handleProcessRowUpdate(updatedProduct, originalProduct) {
    console.log(updatedProduct, originalProduct);
    let different = false;
    for (const [key, value] of Object.entries(updatedProduct)) {
      if (originalProduct[key] != updatedProduct[key]) {
        different = true;
      }
    }
    // if objects are identical, return
    if (!different) return;

    // otherwise, update the product
    updateProducts(updatedProduct);
  }
  function handleProcessRowUpdateError(error) {
    return;
  }

  // Modal event handlers
  function handleOpenModalDeleteProduct() {
    setOpen(true);
  }
  function handleClose(value) {
    setOpen(false);
    if (value === true) {
      handleDeleteProduct();
    }
  }

  if (isLoadingProducts) return <Loader />;
  return (
    <>
      <Header>Products</Header>
      <Modal onClose={handleClose} open={open}>
        Confirm deletion
      </Modal>
      <div className="p-4">
        <div style={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={true}
            onRowSelectionModelChange={(ids) => setSelected(ids)}
            processRowUpdate={handleProcessRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            disableRowSelectionOnClick={true}
            apiRef={apiRef}
          />
        </div>
        {selected?.length > 0 && (
          <div className="py-2 flex gap-2">
            <Button
              variant="contained"
              color="primary"
              startIcon={<PowerIcon />}
              onClick={handleEnableProduct}
            >
              Enable selected
            </Button>

            <Button
              variant="outlined"
              color="warning"
              startIcon={<PowerOffIcon />}
              onClick={handleDisableProduct}
            >
              Disable selected
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenModalDeleteProduct}
            >
              Delete selected
            </Button>
          </div>
        )}
        <Box
          component="div"
          sx={{
            p: 2,
            border: "1px dashed grey",
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            width: "max-content",
            bgcolor: "#f3fbff",
          }}
        >
          <div className="flex py-4 items-center">
            <Typography variant="h5">Add a new product</Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-xs gap-4 py-4">
              <TextField
                id="outlined-basic"
                label="Product name"
                variant="outlined"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, product: e.target.value })
                }
                value={newProduct?.product || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SellIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="outlined-basic"
                label="Price"
                variant="outlined"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                value={newProduct?.price || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            <div className="flex flex-col max-w-xs gap-4 py-4 w-36">
              <Button variant="contained" type="submit">
                Create
              </Button>
              <Button variant="outlined" onClick={handleResetForm}>
                Reset
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </>
  );
}

export default Products;
