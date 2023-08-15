import { formatMoney } from "../../utils/helpers";

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-200 p-4">
        <p>{`${payload[0].payload.name}: ${formatMoney(payload[0].value)}`}</p>
      </div>
    );
  }

  return null;
}

export default CustomTooltip;
