import * as React from "react";
import {
  PolarRadiusAxis,
  PolarAngleAxis,
  PolarGrid,
  RadarChart,
  Radar,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";

function CustomTooltip(e) {
  const { active, label, payload, data } = e;
  const nameOfTooltips = data[0].nameOfTooltips;

  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        {nameOfTooltips.map((v, i) => (
          <p className="tooltip" key={i}>
            {`${v} : ${data[payload[0].payload.id][v]}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function _Radar(props) {
  const { data, size, clickLegend, color } = props;
  const [selectedAngleAxis, setSelectedAngleAxis] = React.useState([]);

  function customTick({ payload, x, y, textAnchor, stroke, radius }) {
    console.log(selectedAngleAxis);

    var fontWeight = "normal";
    if (selectedAngleAxis.find((v) => v === payload.value) !== undefined)
      fontWeight = "bold";
    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text
          radius={radius}
          stroke={stroke}
          fontWeight={fontWeight}
          x={x}
          y={y}
          className="recharts-text recharts-polar-angle-axis-tick-value"
          text-anchor={textAnchor}
        >
          <tspan x={x} dy="0em">
            {payload.value}
          </tspan>
        </text>
      </g>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        width={size}
        height={size}
        data={data}
        onClick={(e, event) => {
          if (e !== null) {
            const _value = e.activeLabel;
            var id;
            data.forEach((v, index) => {
              if (v.category == _value) id = v.id;
            });
            clickLegend(id, event.ctrlKey);

            var new_array = selectedAngleAxis;
            const index = new_array.findIndex((e) => e === _value);
            if (index == -1) {
              if (!event.ctrlKey) new_array = [];
              new_array.push(_value);
            } else new_array.splice(index, 1);
            setSelectedAngleAxis(new_array);
          }
        }}
      >
        <PolarGrid gridType="circle" />
        <PolarAngleAxis
          dataKey="category"
          tick={customTick}
          onClick={(e) => {
            if (e !== null) {
              const _value = e.value;
              var id;
              data.forEach((v, index) => {
                if (v.category == _value) id = v.id;
              });
              clickLegend(id);
            }
          }}
        />
        {/* <PolarRadiusAxis angle={90} axisLine={false} /> */}
        {data[0].nameOfValues.map((v) => (
          <Radar
            dataKey={v}
            cx="50%"
            cy="50%"
            fill={color}
            activeDot={false}
          ></Radar>
        ))}
        {/* <Legend /> */}
        <Tooltip
          animationDuration={800}
          content={<CustomTooltip data={data} />}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
