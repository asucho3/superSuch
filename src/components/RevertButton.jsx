import { useState } from "react";
import Modal from "./Modal";
import { Button } from "@mui/material";

import PowerIcon from "@mui/icons-material/Power";
import PowerOffIcon from "@mui/icons-material/PowerOff";
import DeleteIcon from "@mui/icons-material/Delete";

function RevertButton({ handlerRevertApi, selected, setSelected, gridRef }) {
  function handleRevertRows() {
    handlerRevertApi(selected);
    deselectRows();
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
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleRevertRows}
      >
        Revert selected
      </Button>
    </>
  );
}

export default RevertButton;
