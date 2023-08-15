import { Tooltip, Treemap } from "recharts";
import CustomTooltip from "./CustomTooltip";

function DashboardTreeMap({ data, dataKey, treeMapMode }) {
  console.log(data, treeMapMode);
  return (
    <Treemap
      width={730}
      height={400}
      data={data}
      dataKey={dataKey}
      aspectRatio={4 / 3}
      stroke="#fff"
      fill={treeMapMode === "revenue" ? "#8884d8" : "#82ca9d"}
    >
      <Tooltip content={<CustomTooltip />} />
    </Treemap>
  );
}

export default DashboardTreeMap;
