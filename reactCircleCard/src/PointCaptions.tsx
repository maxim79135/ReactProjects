import * as React from "react";
import { polarToX, polarToY } from "./functions";

export interface CaptionProps {
  size?: number;
  columns: { key: string; angle: number; value: number; id: number }[];
}

class PointCaptions extends React.Component<CaptionProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { columns, size } = this.props;
    const caption = () => (col) => (
      <text
        key={`caption-of-${col.key}`}
        x={polarToX(col.angle, (size / 2) * 0.95).toFixed(4)}
        y={polarToY(col.angle, (size / 2) * 0.95).toFixed(4)}
        dy={10 / 2}
        fill="#444"
        fontWeight="400"
      >
        {col.key}
      </text>
    );
    return <g key={`group-captions`}>{columns.map(caption())}</g>;
  }
}

export default PointCaptions;
