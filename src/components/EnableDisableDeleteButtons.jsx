import { useState } from "react";
import Modal from "./Modal";
import { Button } from "@mui/material";

import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import DeleteIcon from "@mui/icons-material/Delete";

function EnableDisableDeleteButtons({
  handlerUpdateApi,
  handlerDeleteApi,
  selected,
  setSelected,
  gridRef,
}) {
  const [open, setOpen] = useState(false);

  function handleEnableRow() {
    const updatedRow = selected.map((row) => {
      return { id: row, active: true };
    });
    handlerUpdateApi(updatedRow);
    deselectRows();
  }
  function handleDisableRow() {
    const updatedRow = selected.map((row) => {
      return { id: row, active: false };
    });
    handlerUpdateApi(updatedRow);
    deselectRows();
  }
  function handleDeleteRow() {
    handlerDeleteApi(selected);
    deselectRows();
  }

  // Modal event handlers
  function handleOpenModalDeleteRow() {
    setOpen(true);
  }
  function handleClose(value) {
    setOpen(false);
    if (value === true) {
      handleDeleteRow();
    }
  }

  // helper function to deselect rows from the grid
  function deselectRows() {
    const selectedRows = gridRef.current.getSelectedRows();
    for (const [key, value] of selectedRows.entries()) {
      gridRef.current.selectRow(key, false);
    }
    setSelected();
  }
  return (
    <>
      <Modal onClose={handleClose} open={open}>
        Confirm deletion
      </Modal>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PowerIcon />}
        onClick={handleEnableRow}
      >
        Enable selected
      </Button>

      <Button
        variant="outlined"
        color="warning"
        startIcon={<PowerOffIcon />}
        onClick={handleDisableRow}
      >
        Disable selected
      </Button>

      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleOpenModalDeleteRow}
      >
        Delete selected
      </Button>
    </>
  );
}

export default EnableDisableDeleteButtons;
