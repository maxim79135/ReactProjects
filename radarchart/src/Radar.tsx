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
} from "recharts";

function CustomTooltip(e) {
  const { active, label, payload, data } = e;
  const nameOfTooltips = data[0].nameOfTooltips;

  if (active) {
    console.log(e);

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
  const { data, size, clickLegend } = props;

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
          }
        }}
      >
        <PolarGrid gridType="circle" />
        <PolarAngleAxis
          dataKey="category"
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
        <PolarRadiusAxis angle={90} />
        {data[0].nameOfValues.map((v) => (
          <Radar
            dataKey={v}
            cx="50%"
            cy="50%"
            fill="#8884d8"
            activeDot={false}
          ></Radar>
        ))}
        <Legend />
        <Tooltip
          animationDuration={800}
          content={<CustomTooltip data={data} />}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
