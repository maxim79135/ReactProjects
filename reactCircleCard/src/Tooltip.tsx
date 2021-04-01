import * as React from "react";

function Tooltip(props) {
  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);

  function mouseMoveHandler(e) {
    console.log(e);
    setX(e.x);
    setY(e.y);
    console.log(x, y);
  }

  React.useEffect(() => {
    // document.addEventListener("mousemove", mouseMoveHandler);

    return () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  });

  return (
    <g key="tooltip">
      <rect className="tooltip-rect" x={x - 100} y={y - 100}>
        <animate
          attributeType="CSS"
          attributeName="opacity"
          from="0"
          to="1"
          dur="5s"
          repeatCount="1"
        />
      </rect>
    </g>
  );
}

export default Tooltip;
