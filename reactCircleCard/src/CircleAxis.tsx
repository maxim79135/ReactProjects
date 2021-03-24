import * as React from "react";

function CircleAxis(props) {
  const { size, numberOfScales } = props;
  const scales = [];

  for (var i = numberOfScales; i > 0; i--) scales.push(i);

  return (
    <g key={`scales`}>
      {scales.map((value) => (
        <circle
          key={`scale-${value}`}
          cx={0}
          cy={0}
          r={((value / numberOfScales) * size) / 2}
          fill="#FAFAFA"
          stroke="#999"
          strokeWidth="0.2"
        />
      ))}
    </g>
  );
}

export default CircleAxis;
