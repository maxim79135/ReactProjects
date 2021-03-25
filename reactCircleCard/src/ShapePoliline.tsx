import * as React from "react";

import pathDefinition from "./functions";
import { polarToX, polarToY } from "./functions";

function ShapePoliline(props) {
  const { columns, values, maxValue, size } = props;

  return (
    <g key={`groups}`}>
      <path
        key={`shape-0`}
        d={pathDefinition(
          columns.map((col, i) => {
            const value = (values[i] / maxValue) * 0.9;
            return [
              polarToX(col.angle, (value * size) / 2),
              polarToY(col.angle, (value * size) / 2),
            ];
          })
        )}
        stroke={`#edc951`}
        fill={`#edc951`}
        fillOpacity=".5"
        className="shape"
      />
    </g>
  );
}

export default ShapePoliline;
