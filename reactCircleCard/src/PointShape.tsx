import * as React from "react";
import { polarToX, polarToY } from "./functions";

function PointShape(props) {
  const { size, columns, maxValue, clickPoint } = props;
  return (
    <g key={"group-point-shape"}>
      {columns.map((col) => (
        <circle
          key={`scale-${col.key}`}
          cx={polarToX(
            col.angle,
            (((size / 2) * col.value) / maxValue) * 0.9
          ).toFixed(4)}
          cy={polarToY(
            col.angle,
            (((size / 2) * col.value) / maxValue) * 0.9
          ).toFixed(4)}
          r={10}
          fill="#FAFAFA"
          stroke="#999"
          strokeWidth="0.2"
          className="group-point-shape"
          onClick={() => {
            clickPoint(col);
          }}
        />
      ))}
    </g>
  );
}

export default PointShape;
