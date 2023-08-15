import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import SellIcon from "@mui/icons-material/Sell";
import HomeIcon from "@mui/icons-material/Home";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useCreateTestData } from "../hooks/useCreateTestData";

function Sidebar() {
  const [selected, setSelected] = useState();
  const { createTestData, isCreating } = useCreateTestData();

  function handleUploadTestData() {
    createTestData();
  }

  return (
    <div className="bg-zinc-200 h-full flex flex-col gap-8 p-4">
      <div className="flex justify-center">
        <img src="../img/logo.png" className="w-1/2"></img>
      </div>

      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => setSelected("Home")}
            selected={selected === "Home"}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/Products"
            onClick={() => setSelected("Products")}
            selected={selected === "Products"}
          >
            <ListItemIcon>
              <SellIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Inventory"
            onClick={() => setSelected("Inventory")}
            selected={selected === "Inventory"}
          >
            <ListItemIcon>
              <ViewModuleIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/Sales"
            onClick={() => setSelected("Sales")}
            selected={selected === "Sales"}
          >
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Sales" />
          </ListItemButton>
        </ListItem>

        <div className="bg-yellow-600 p-4 flex w-full text-center mt-8 rounded">
          <ListItem disablePadding>
            <ListItemButton onClick={handleUploadTestData}>
              <ListItemText
                primary={
                  <Typography style={{ color: "#fff", width: "100%" }}>
                    Upload test data
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </div>
      </List>
    </div>
  );
}

export default Sidebar;
