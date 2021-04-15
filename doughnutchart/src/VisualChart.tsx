import * as React from "react";
import DoughnutChart from "./DoughnutChart";
import _Pie from "./Pie";
import _Radar from "./Radar";

export interface State {
  width?: number;
  height?: number;
  size?: number;
  chartData;
  clickLegend: (col, multiSelect) => void;
  countTooltipData: number;
}

const initialState: State = {
  chartData: [],
  clickLegend: null,
  countTooltipData: 0,
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
      chartData,
      clickLegend,
      countTooltipData,
    } = this.state;

    if (this.state !== initialState) {
      console.log(chartData);

      return <_Radar data={chartData} size={size} clickLegend={clickLegend} />;
    }
    return null;
  }
}

export default VisualChart;
