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
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        {data.map((v, i) => (
          <p className="tooltip" key={i}>
            {`${v.name} : ${v.values[payload[0].payload.id].value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function _Radar(props) {
  const { data, size, clickLegend, max_value, tooltipData } = props;
  const [opacity, setOpacity] = React.useState(1);
  const [angleTooltip, setAngleTooltip] = React.useState(false);

  console.log(data);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        width={size}
        height={size}
        data={data}
        onClick={(e, event) => {
          if (e !== null) {
            console.log(e);
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
        <Radar
          dataKey="value"
          cx="50%"
          cy="50%"
          fill="#8884d8"
          fillOpacity={opacity}
          onMouseEnter={(e) => {
            setOpacity(0.5);
          }}
          onMouseOut={(e) => {
            setOpacity(1);
          }}
          dot={{ r: 5 }}
          activeDot={false}
        ></Radar>
        <Tooltip content={<CustomTooltip data={tooltipData} />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
