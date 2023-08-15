import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import Loader from "../components/Loader";
import SalesChart from "../components/SalesChart";
import useSales from "../features/sales/useSales";
import DashboardCard from "../features/dashboard/DashboardCard";
import Dashboard from "../features/dashboard/Dashboard";

function Home() {
  return (
    <>
      <Header>Dashboard</Header>
      <Dashboard />
    </>
  );
}

export default Home;
