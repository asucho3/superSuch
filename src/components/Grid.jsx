import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

function Grid({
  rows,
  columns,
  handlerApi,
  setSelected,
  gridRef,
  aggregateField = "",
  noZeroRows = false,
}) {
  // DataGrid API
  const apiRef = useGridApiRef();
  gridRef.current = apiRef.current;
  function handleProcessRowUpdateError() {
    return;
  }

  const [modifiedRows, setModifiedRows] = useState(rows);
  const [modifiedColumns, setModifiedColumns] = useState(columns);

  function handleProcessRowUpdate(updatedRows, originalRows) {
    let different = false;
    for (const [key, value] of Object.entries(updatedRows)) {
      if (originalRows[key] != updatedRows[key]) {
        different = true;
      }
    }
    // if objects are identical, return
    if (!different) return;

    // update the rows
    handlerApi(updatedRows);
  }

  // handle data aggregation
  useEffect(
    function () {
      if (aggregateField === "product") {
        // 0. create a set to get each unique value of product and immediately spread it into an array
        const uniqueProducts = [
          ...new Set(modifiedRows.map((modifiedRow) => modifiedRow.product)),
        ];

        // 1. clear the modifiedRows
        setModifiedRows([]);

        // 2. loop through the unique products and determine the appropiate values
        for (const uniqueProduct of uniqueProducts) {
          const uniqueProductObj = modifiedRows.find(
            (modifiedRow) => modifiedRow.product === uniqueProduct
          );
          const totalQuantity = modifiedRows.reduce(
            (acc, cur) =>
              uniqueProduct === cur.product ? acc + cur.quantity : acc,
            0
          );
          const totalCost = modifiedRows.reduce(
            (acc, cur) =>
              uniqueProduct === cur.product ? acc + cur.totalCost : acc,
            0
          );
          setModifiedRows((modifiedRows) => [
            ...modifiedRows,
            {
              id: uniqueProduct,
              productId: uniqueProductObj.productId,
              cost: uniqueProductObj.cost,
              active: uniqueProductObj.active,
              product: uniqueProduct,
              quantity: totalQuantity,
              totalCost,
            },
          ]);
        }
        // get rid of columns that make no sense in this context
        const excludeColumns = ["expiration", "expired", "id", "cost"];
        for (const column of modifiedColumns) {
          if (excludeColumns.includes(column.field)) {
            setModifiedColumns((modifiedColumns) =>
              modifiedColumns.filter(
                (modifiedColumn) => modifiedColumn.field !== column.field
              )
            );
          }
        }
      } else {
        setModifiedColumns(columns);
        setModifiedRows(rows);
      }
    },
    [aggregateField, columns, rows]
  );

  // handle no-zero-rows filter
  useEffect(
    function () {
      if (noZeroRows) {
        setModifiedRows((modifiedRows) =>
          modifiedRows.filter((row) => row.quantity > 0)
        );
      } else {
        modifiedRows.filter((row) => row.quantity >= 0);
      }
    },
    [noZeroRows]
  );

  return (
    <DataGrid
      rows={modifiedRows}
      columns={modifiedColumns}
      editMode="row"
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
      checkboxSelection={aggregateField === ""}
      onRowSelectionModelChange={(ids) => setSelected(ids)}
      processRowUpdate={handleProcessRowUpdate}
      onProcessRowUpdateError={handleProcessRowUpdateError}
      disableRowSelectionOnClick={true}
      apiRef={apiRef}
    />
  );
}

export default Grid;
