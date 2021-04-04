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
        onClick={(e) => {
          if (e !== null) {
            console.log(e);
            const _index = e.activeTooltipIndex;
            var id;
            data.forEach((v, index) => {
              console.log(v);
              if (v.id == _index) id = index;
            });
            clickLegend(id);
          }
        }}
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="category"
          onClick={(e) => {
            if (e !== null) {
              console.log(e);
              const _index = e.index;
              var id;
              data.forEach((v, index) => {
                console.log(v);
                if (v.id == _index) id = index;
              });
              clickLegend(id);
            }
          }}
        />
        <PolarRadiusAxis angle={30} domain={[0, max_value]} />
        <Radar dataKey="value" cx="50%" cy="50%" fill="#8884d8"></Radar>
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default _Radar;
