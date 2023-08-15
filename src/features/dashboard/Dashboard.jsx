import { Legend, Tooltip, Treemap } from "recharts";
import Loader from "../../components/Loader";
import SalesChart from "../../components/SalesChart";
import { formatMoney } from "../../utils/helpers";
import useInventory from "../inventory/useInventory";
import { useProducts } from "../products/useProducts";
import useSales from "../sales/useSales";
import DashboardCard from "./DashboardCard";
import DashboardTreeMap from "./DashboardTreeMap";
import { useState } from "react";
import { sub } from "date-fns";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";

function Dashboard() {
  const [sinceTime, setSinceTime] = useState(1);
  const [treeMapMode, setTreeMapMode] = useState("revenue");
  const [groupMonth, setGroupMonth] = useState(false);

  const { products, isLoading: isLoadingProducts } = useProducts();
  const { inventory, isLoading: isLoadingInventory } = useInventory();
  const { sales, isLoading: isLoadingSales } = useSales();

  if (isLoadingProducts || isLoadingInventory || isLoadingSales)
    return <Loader />;

  // filter by date
  const filteredSales = sales.filter(
    (sale) =>
      new Date(sale.date) >=
      new Date(
        sub(new Date(), {
          years: 0,
          months: 0,
          weeks: 0,
          days: sinceTime,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      )
  );

  // products statistics
  const activeProducts = products.reduce(
    (acc, cur) => acc + (cur.active === "Yes" ? 1 : 0),
    0
  );

  // inventory statistics
  const inventoryCapital = inventory.reduce(
    (acc, cur) => acc + cur.totalCost,
    0
  );

  // sales statistics
  const salesCashThisPeriod = filteredSales.reduce(
    (acc, cur) => acc + cur.totalPrice,
    0
  );
  const salesUnitsThisPeriod = filteredSales.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  );
  const salesGrossProfitThisPeriod = filteredSales.reduce(
    (acc, cur) => acc + cur.grossProfit,
    0
  );
  const salesNetProfitThisPeriod = filteredSales.reduce(
    (acc, cur) => acc + cur.netProfit,
    0
  );

  // prepare tree map of products
  const uniqueProducts = [
    ...new Set(filteredSales.map((salesRow) => salesRow.product)),
  ];
  const totalSalesByProduct = uniqueProducts
    .map((uniqueProduct) => {
      return {
        name: uniqueProduct,
        totalSales: filteredSales.reduce(
          (acc, cur) =>
            acc + (cur.product === uniqueProduct ? cur.totalPrice : 0),
          0
        ),
      };
    })
    .sort((a, b) => b.totalSales - a.totalSales);
  const totalGrossProfitByProduct = uniqueProducts
    .map((uniqueProduct) => {
      return {
        name: uniqueProduct,
        totalGrossProfit: filteredSales.reduce(
          (acc, cur) =>
            acc + (cur.product === uniqueProduct ? cur.grossProfit : 0),
          0
        ),
      };
    })
    .sort((a, b) => b.totalGrossProfit - a.totalGrossProfit);

  function handleChangeDateFilter(days) {
    setSinceTime(days);
    setGroupMonth(() => (days <= 30 ? false : groupMonth));
  }

  function handleChangeTreeMapMode(mode) {
    setTreeMapMode(mode);
  }

  // grouping option
  function handleToggleGroupMonth() {
    setGroupMonth((groupMonth) => !groupMonth);
  }

  return (
    <div className="flex my-4 justify-center gap-12 bg-stone-200 py-4 w-3/4 mx-auto rounded">
      <div className="flex flex-col gap-4 mt-8">
        <FormControl fullWidth>
          <InputLabel>Filter date</InputLabel>
          <Select
            value={sinceTime}
            label="Date filter"
            onChange={(e) => handleChangeDateFilter(e.target.value)}
          >
            <MenuItem value={1}>Last 24hs</MenuItem>
            <MenuItem value={7}>Last week</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={365}>Last year</MenuItem>
            <MenuItem value={9999}>All time</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>TreeMap mode</InputLabel>
          <Select
            value={treeMapMode}
            label="TreeMap mode"
            onChange={(e) => handleChangeTreeMapMode(e.target.value)}
          >
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="grossProfit">Gross profit</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={groupMonth}
              disabled={sinceTime <= 30}
              onChange={handleToggleGroupMonth}
              inputProps={{ "aria-label": "controlled" }}
            />
          }
          label="Group by month"
        />
      </div>
      <div className="flex flex-col gap-4">
        <SalesChart
          sales={filteredSales}
          period={sinceTime}
          groupMonth={groupMonth}
        />
        <DashboardTreeMap
          data={
            treeMapMode === "revenue"
              ? totalSalesByProduct
              : totalGrossProfitByProduct
          }
          dataKey={
            treeMapMode === "revenue" ? "totalSales" : "totalGrossProfit"
          }
          treeMapMode={treeMapMode}
        />
      </div>
      <div className="flex flex-col gap-4 justify-center">
        <DashboardCard
          array={[
            {
              title: "Active products",
              value: activeProducts,
            },
          ]}
        />
        <DashboardCard
          array={[
            {
              title: "Current inventory",
              value: formatMoney(inventoryCapital),
            },
          ]}
        />
        <DashboardCard
          array={[
            {
              title: "Units sold",
              value: salesUnitsThisPeriod,
            },
            {
              title: "Revenue",
              value: formatMoney(salesCashThisPeriod),
            },
          ]}
          period={sinceTime}
        />
        <DashboardCard
          array={[
            {
              title: "Gross profit",
              value: formatMoney(salesGrossProfitThisPeriod),
            },
            {
              title: "Net profit",
              value: formatMoney(salesNetProfitThisPeriod),
            },
          ]}
          period={sinceTime}
        />
      </div>
      <Tooltip />
    </div>
  );
}

export default Dashboard;
