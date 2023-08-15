import { InputAdornment, TextField, Autocomplete } from "@mui/material";

import SellIcon from "@mui/icons-material/Sell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import NumbersIcon from "@mui/icons-material/Numbers";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useState } from "react";

function TextFieldInput({
  setState,
  state,
  field,
  label,
  icon,
  type,
  required,
  options,
  disabled,
  onChange,
}) {
  const [displayValues, setDisplayValues] = useState();

  return (
    <>
      {options?.length >= 0 ? (
        <Autocomplete
          options={options}
          sx={{ width: 300 }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label={label}
                InputProps={{
                  // MUST INCLUDE THE FOLLOWING LINE TO SHOW OPTIONS WHEN USING AUTOCOMPLETE AND ADORNMENTS!!
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        {icon === "SellIcon" ? <SellIcon /> : ""}
                        {icon === "AttachMoneyIcon" ? <AttachMoneyIcon /> : ""}
                        {icon === "NumbersIcon" ? <NumbersIcon /> : ""}
                        {icon === "CalendarMonthIcon" ? (
                          <CalendarMonthIcon />
                        ) : (
                          ""
                        )}
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            );
          }}
          value={state?.[field] || null}
          onChange={(e, newValue) => onChange(e, newValue, field)}
        />
      ) : (
        <TextField
          disabled={disabled}
          label={label}
          type={type}
          id="outlined-basic"
          required={required}
          variant="outlined"
          onChange={(e) => {
            const newState = { ...state };
            newState[field] = e.target.value;
            setState(newState);
          }}
          value={state?.[field] || ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {icon === "SellIcon" ? <SellIcon /> : ""}
                {icon === "AttachMoneyIcon" ? <AttachMoneyIcon /> : ""}
                {icon === "NumbersIcon" ? <NumbersIcon /> : ""}
                {icon === "CalendarMonthIcon" ? <CalendarMonthIcon /> : ""}
              </InputAdornment>
            ),
          }}
        />
      )}
    </>
  );
}

export default TextFieldInput;
