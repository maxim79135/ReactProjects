import * as React from "react";
import _Radar from "./Radar";
import { VisualSettings } from "./settings";

export interface State {
  width?: number;
  height?: number;
  size?: number;
  chartData;
  colors?: { value: string }[];
  clickLegend: (col, multiSelect) => void;
  countTooltipData: number;
  settings?: VisualSettings;
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
      colors,
      settings,
    } = this.state;

    // if (this.state !== initialState) {
    return (
      <_Radar
        data={chartData}
        size={size}
        clickLegend={clickLegend}
        colors={colors}
        settings={settings}
      />
    );
    // } else return null;
  }
}

export default VisualChart;
