import { Typography } from "@mui/material";

function Header({ children }) {
  return (
    <div className="bg-slate-100 p-4">
      <Typography variant="h3">{children}</Typography>
    </div>
  );
}

export default Header;
