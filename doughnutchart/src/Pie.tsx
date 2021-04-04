import * as React from "react";
import { PieChart, Pie, Tooltip, Legend } from "recharts";

function _Pie(props) {
  const { data, size, clickLegend } = props;
  console.log(data);
  return (
    // <ResponsiveContainer width="100%" height="100%">
    <PieChart width={size} height={size}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="category"
        cx="50%"
        cy="50%"
        fill="#8884d8"
        onClick={(e) => {
          console.log(e);
          clickLegend(e.id);
        }}
      ></Pie>
      <Tooltip
        content={(e) => {
          console.log(e);
          //   if (active && payload && payload.length) {
          //     return (
          //       <div className="custom-tooltip">
          //         <p className="label">{`${label} : ${payload[0].value}`}</p>
          //         <p className="desc">Anything you want can be displayed here.</p>
          //       </div>
          //     );
          //   }

          return null;
        }}
      />
      <Legend
        onClick={(e) => {
          console.log(e);
          clickLegend(e.payload.id);
        }}
      />
    </PieChart>
    // </ResponsiveContainer>
  );
}

export default _Pie;
