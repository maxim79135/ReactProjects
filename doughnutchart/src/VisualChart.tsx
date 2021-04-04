import * as React from "react";
import DoughnutChart from "./DoughnutChart";
import _Pie from "./Pie";
import _Radar from "./Radar";

export interface State {
  width?: number;
  height?: number;
  size?: number;
  category: string[];
  values: string[];
  clickLegend: (col, multiSelect) => void;
}

const initialState: State = {
  category: [],
  values: [],
  clickLegend: null,
};

export class VisualChart extends React.Component<State> {
  private static updateCallback: (data: object) => void = null;
  state: State = initialState;

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  public static update(newState: State) {
    if (typeof VisualChart.updateCallback == "function") {
      VisualChart.updateCallback(newState);
    }
  }

  public componentWillMount() {
    VisualChart.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    VisualChart.updateCallback = null;
  }

  render() {
    const { width, height, size, values, category, clickLegend } = this.state;

    const chartData = category
      .map((v, i) => {
        return {
          category: v,
          value: Number(values[i]),
          id: i,
        };
      })
      .sort((a, b) => (a.category > b.category ? 1 : -1));

    const new_category = chartData.map((v) => v.category);
    const max_value = Math.max.apply(
      null,
      values.map((v) => Number(v))
    );

    console.log(chartData);
    return (
      // <_Pie data={chartData} size={size} clickLegend={clickLegend} />
      <_Radar data={chartData} size={size} clickLegend={clickLegend} max_value={max_value}/>
    );
  }
}

export default VisualChart;
