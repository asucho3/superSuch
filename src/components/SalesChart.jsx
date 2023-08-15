import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDate, getMonth } from "../utils/helpers";

function SalesChart({ sales, period, groupMonth }) {
  // 0. add the formatted date
  const salesObj = sales.map((sale) => {
    return {
      ...sale,
      date:
        groupMonth && period > 30
          ? getMonth(sale.date).replace("-", " ")
          : formatDate(sale.date),
    };
  });

  // 1. get unique values for each date
  const uniqueDates = [...new Set(salesObj.map((sale) => sale.date))];

  // 2. add the total price per date
  const dateSum = uniqueDates
    .map((uniqueDate) => {
      return {
        uniqueDate,
        revenue: salesObj.reduce(
          (acc, cur) => (cur.date === uniqueDate ? acc + cur.totalPrice : acc),
          0
        ),
        operatingIncome: salesObj.reduce(
          (acc, cur) => (cur.date === uniqueDate ? acc + cur.grossProfit : acc),
          0
        ),
        regularDate: new Date(uniqueDate),
      };
    })
    .sort((a, b) => a.regularDate - b.regularDate);

  return (
    <>
      {period === 1 && (
        <ResponsiveContainer height="50%">
          <BarChart data={dateSum}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="uniqueDate" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
            <Bar dataKey="operatingIncome" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      )}
      {period > 1 && (
        <ResponsiveContainer height="50%">
          <AreaChart
            data={dateSum}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="uniqueDate" />
            <YAxis unit="$" padding={{ top: 20 }} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Area
              name="revenue"
              type="monotone"
              dataKey="revenue"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
            <Area
              name="gross profit (revenue - cost)"
              type="monotone"
              dataKey="operatingIncome"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorPv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
}

export default SalesChart;
