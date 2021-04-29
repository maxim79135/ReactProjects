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
        <h1 className="header"></h1>
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
  const { data, size, clickLegend, colors, settings } = props;
  const [selectedAngleAxis, setSelectedAngleAxis] = React.useState([]);

  if (data.length == 0) return null;

  function customTick({ payload, x, y, textAnchor, stroke, radius }) {
    var fontWeight = "normal";
    if (selectedAngleAxis.find((v) => v === payload.value) !== undefined)
      fontWeight = "bold";
    return (
      <g className="recharts-layer recharts-polar-angle-axis-tick">
        <text
          radius={radius}
          stroke={stroke}
          fontWeight={fontWeight}
          fontSize={settings.labelAxis.fontSize}
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
            setSelectedAngleAxis((prev_state) => {
              const index = prev_state.findIndex((e) => e === _value);
              if (index == -1) {
                if (!event.ctrlKey) prev_state = [];
                prev_state.push(_value);
              } else {
                if (!event.ctrlKey && prev_state.length == 1) return [];

                if (!event.ctrlKey) return [_value];
                else prev_state.splice(index, 1);
              }
              console.log(prev_state);

              return prev_state;
            });
          }
        }}
      >
        <PolarGrid gridType="circle" />
        <PolarRadiusAxis
          angle={90}
          tick={settings.labelAxis.isEnableTick}
          tickCount={settings.labelAxis.tickCount}
          fontSize={settings.labelAxis.fontSize}
          domain={[settings.labelAxis.minValue, settings.labelAxis.maxValue]}
        />
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
        {data[0].nameOfValues.map((v, i) => (
          <Radar
            name={v}
            dataKey={v}
            cx="50%"
            cy="50%"
            fill={colors[i]}
            fillOpacity={settings.shape.opacity}
            activeDot={false}
          ></Radar>
        ))}
        {/* <Legend /> */}
        <Tooltip
          animationDuration={800}
          // content={<CustomTooltip data={data} />}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
