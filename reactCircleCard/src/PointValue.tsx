import * as React from "react";
import { polarToX, polarToY } from "./functions";

function PointValue(props) {
  const { columns, size, maxValue } = props;

  const textValue = () => (col) => (
    <text
      key={`caption-of-${col.key}`}
      x={polarToX(
        col.angle,
        (((size / 2) * col.value) / maxValue) * 0.9
      ).toFixed(4)}
      y={polarToY(
        col.angle,
        (((size / 2) * col.value) / maxValue) * 0.9
      ).toFixed(4)}
      dy={10 / 2}
      fill="#444"
      fontWeight="400"
    >
      {col.value.toFixed(2)}
    </text>
  );

  return <g key={`group-text-values`}>{columns.map(textValue())}</g>;
}

export default PointValue;
