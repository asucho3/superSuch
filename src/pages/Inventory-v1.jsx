import Header from "../components/Header";
import { DataGrid, useGridApiContext, useGridApiRef } from "@mui/x-data-grid";
import { useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import Loader from "../components/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import Modal from "../components/Modal";

import useInventory from "../features/inventory/useInventory";
import { useCreateInventory } from "../features/inventory/useCreateInventory";
import { useDeleteInventory } from "../features/inventory/useDeleteInventory";
import { useUpdateInventory } from "../features/inventory/useUpdateInventory";
// Designate the field names for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, editable: false },
  { field: "product", headerName: "Product", width: 130, editable: true },
  { field: "cost", headerName: "Cost", width: 130, editable: true },
  { field: "quantity", headerName: "Quantity", width: 130, editable: true },
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

function Inventory() {
  // State variables for controlled elements
  const [selected, setSelected] = useState();
  const [newInventory, setNewInventory] = useState();
  const [open, setOpen] = useState(false);

  // Get the mutation functions from custom hooks
  const { createInventory, isCreating } = useCreateInventory();
  const { deleteInventory, isDeleting } = useDeleteInventory();
  const { updateInventory, isUpdating } = useUpdateInventory();

  // Get the query function to get all products from custom hook
  const { inventory: rows, isLoading: isLoadingInventory } = useInventory();

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

  // Event handlers
  function handleResetForm() {
    setNewInventory({});
  }

  function handleSubmit(e) {
    e.preventDefault();
    // guard clause
    if (
      !newInventory?.product ||
      !newInventory?.cost ||
      !newInventory?.quantity
    )
      return;
    createInventory(newInventory, { onSuccess: setNewInventory() });
  }

  function handleEnableInventory() {
    const updatedInventory = selected.map((inventory) => {
      return { id: inventory, active: true };
    });
    updateInventory(updatedInventory);
    deselectRows();
  }
  function handleDisableInventory() {
    const updatedInventory = selected.map((inventory) => {
      return { id: inventory, active: false };
    });
    updateInventory(updatedInventory);
    deselectRows();
  }
  function handleDeleteInventory() {
    deleteInventory(selected);
    deselectRows();
  }

  // Edit events
  function handleProcessRowUpdate(updatedInventory, originalInventory) {
    let different = false;
    for (const [key, value] of Object.entries(updatedInventory)) {
      if (originalInventory[key] != updatedInventory[key]) {
        different = true;
      }
    }
    // if objects are identical, return
    if (!different) return;

    // remove accesory fields that don't exist in the server or shouldn't be updated
    delete updatedInventory.expiration;
    delete updatedInventory.expired;

    // update the Inventory
    updateInventory(updatedInventory);
  }
  function handleProcessRowUpdateError(error) {
    return;
  }

  // Modal event handlers
  function handleOpenModalDeleteInventory() {
    setOpen(true);
  }
  function handleClose(value) {
    setOpen(false);
    if (value === true) {
      handleDeleteInventory();
    }
  }

  if (isLoadingInventory) return <Loader />;
  return (
    <>
      <Header>Inventory</Header>
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
              onClick={handleEnableInventory}
            >
              Enable selected
            </Button>

            <Button
              variant="outlined"
              color="warning"
              startIcon={<PowerOffIcon />}
              onClick={handleDisableInventory}
            >
              Disable selected
            </Button>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenModalDeleteInventory}
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
            <Typography variant="h5">Add to inventory</Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col max-w-xs gap-4 py-4">
              <TextField
                id="outlined-basic"
                label="Product name"
                required={true}
                variant="outlined"
                onChange={(e) =>
                  setNewInventory({
                    ...newInventory,
                    product: e.target.value,
                  })
                }
                value={newInventory?.product || ""}
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
                label="Cost"
                required={true}
                variant="outlined"
                onChange={(e) =>
                  setNewInventory({ ...newInventory, cost: e.target.value })
                }
                value={newInventory?.cost || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                id="outlined-basic"
                label="Quantity"
                required={true}
                variant="outlined"
                onChange={(e) =>
                  setNewInventory({ ...newInventory, quantity: e.target.value })
                }
                value={newInventory?.quantity || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                type="date"
                id="outlined-basic"
                label="Expiration"
                required={false}
                variant="outlined"
                onChange={(e) =>
                  setNewInventory({
                    ...newInventory,
                    expiration: e.target.value,
                  })
                }
                value={newInventory?.expiration || ""}
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
              <Button variant="outlined" type="reset" onClick={handleResetForm}>
                Reset
              </Button>
            </div>
          </form>
        </Box>
      </div>
    </>
  );
}

export default Inventory;
