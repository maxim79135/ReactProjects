import * as React from "react";

import { Doughnut } from "react-chartjs-2";

function DoughnutChart(props) {
  const { size, category, values} = props;
  console.log(category)

  return (
    <Doughnut
      data={{
        datasets: [
          {
            data: values,
            backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
          },
        ],

        labels: category,
      }}
      width={size}
      height={size}
    />
  );
}

export default DoughnutChart;
