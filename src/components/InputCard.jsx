import { Box, Typography } from "@mui/material";

function InputCard({ title, children }) {
  return (
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
        <Typography variant="h5">{title}</Typography>
      </div>
      {children}
    </Box>
  );
}

export default InputCard;
