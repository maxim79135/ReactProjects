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
  countTooltipData: number;
  tooltipData: { name: string; values: [] }[];
  maxValue?;
}

const initialState: State = {
  category: [],
  values: [],
  clickLegend: null,
  countTooltipData: 0,
  tooltipData: [],
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
    const {
      width,
      height,
      size,
      values,
      category,
      clickLegend,
      countTooltipData,
      tooltipData,
      maxValue,
    } = this.state;

    const chartData = category
      .map((v, i) => {
        return {
          category: v,
          value: Number(values[i]),
          id: i,
        };
      })
      .sort((a, b) => (a.category > b.category ? 1 : -1));

    console.log(chartData);
    console.log(tooltipData);

    return (
      <_Radar
        data={chartData}
        size={size}
        clickLegend={clickLegend}
        max_value={maxValue}
        tooltipData={tooltipData}
      />
    );
  }
}

export default VisualChart;
