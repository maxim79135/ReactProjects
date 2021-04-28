import * as React from "react";

interface Props {
  size: number;
}

function Card(props: Props) {
  const { size } = props;
  const middleOfChart = (size / 2).toFixed(4);
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      className="main"
    >
      <g transform={`translate(${middleOfChart},${middleOfChart})`}>
        <circle cx="50" cy="50" r="40" stroke="red" strokeWidth="5" />
        <circle cx="150" cy="50" r="4" />
      </g>
    </svg>
  );
}

export default Card;
