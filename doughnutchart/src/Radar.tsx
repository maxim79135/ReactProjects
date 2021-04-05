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

function _Radar(props) {
  const { data, size, clickLegend, max_value } = props;
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
              console.log(e);
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
        <Radar dataKey="value" cx="50%" cy="50%" fill="#8884d8"></Radar>
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
