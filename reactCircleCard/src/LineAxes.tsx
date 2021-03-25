import * as React from "react";
import { polarToX, polarToY } from "./functions";

export interface AxesProps {
  size?: number;
  columns: { key: string; angle: number; value: number }[];
}

class LineAxes extends React.Component<AxesProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { columns, size } = this.props;
    const _points = (points) => {
      return points
        .map((point) => point[0].toFixed(4) + "," + point[1].toFixed(4))
        .join(" ");
    };

    const axis = () => (col, i) => (
      <polyline
        key={`poly-axis-${i}`}
        points={_points([
          [0, 0],
          [polarToX(col.angle, size / 2), polarToY(col.angle, size / 2)],
        ])}
        stroke="#555"
        strokeWidth=".2"
      />
    );
    return <g key={`group-axes`}>{columns.map(axis())}</g>;
  }
}

export default LineAxes;
