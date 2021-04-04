import * as React from "react";
import 'regenerator-runtime/runtime'

import { Doughnut } from "react-chartjs-2";

function DoughnutChart(props) {
  const { data, clickLegend } = props;
  var chartReference;

  function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function (property) {
      return typeof object[property] == "function";
    });
  }

  return (
    <Doughnut
      ref={(reference_) => (chartReference = reference_)}
      data={{
        datasets: [
          {
            data: data.map((v) => v.value),
            backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe"],
          },
        ],

        labels: data.map((v) => v.category),
      }}
      options={{
        legend: {
          onClick: function (e, legendItem, legend) {
            console.log(getAllMethods(chartReference));
            clickLegend(legendItem.index, e.ctrlKey);
            const index = legendItem.datasetIndex;
            const ci = chartReference;
            console.log(ci);
            if (ci !== []) ci.hide(index);
          },
        },
      }}
    />
  );
}

export default DoughnutChart;
