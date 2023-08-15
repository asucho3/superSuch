import { Button } from "@mui/material";
import TextFieldInput from "./TextFieldInput";
import { useState } from "react";

function InputForm({
  inputFields,
  mandatoryFields = [],
  handlerCreateApi,
  disabledFields = [],
  tableData,
  displayFields = [],
}) {
  const [state, setState] = useState();

  // when the controlled element for the id changes, search for the display values on the reference table (example: when selecting the inventoryId from the dropdown list, look for that id on the tableData -> joinTable, so that we can retrieve all the information for this inventory row)
  function handleChange(e, newValue, field) {
    setState({ ...state, [field]: newValue });
    if (displayFields?.length > 0) {
      for (const displayField of displayFields) {
        const tableElement = tableData.find(
          (element) => Number(element.id) === Number(newValue)
        );
        setState((state) => {
          return tableElement
            ? { ...state, [displayField]: tableElement[displayField] }
            : {};
        });
      }
    }
  }

  function handleResetForm() {
    setState({});
  }
  function handleSubmit(e) {
    e.preventDefault();
    console.log(state);
    handlerCreateApi(state, { onSuccess: setState() });
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col max-w-xs gap-4 py-4">
        {inputFields.map((inputField) => {
          return (
            <TextFieldInput
              setState={setState}
              state={state}
              field={inputField.field}
              required={mandatoryFields.includes(inputField.field)}
              label={inputField.label}
              icon={inputField.icon}
              type={inputField.type}
              key={inputField.field}
              options={inputField.options}
              disabled={disabledFields.includes(inputField.field)}
              tableData={tableData}
              displayFields={displayFields}
              onChange={handleChange}
            />
          );
        })}
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
  );
}

export default InputForm;
