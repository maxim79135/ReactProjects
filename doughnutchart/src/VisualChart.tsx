import * as React from "react";
import DoughnutChart from "./DoughnutChart";

export interface State {
  width: number;
  height: number;
  size: number;
  category: string[];
  values: string[];
}

const initialState: State = {
  width: 480,
  height: 480,
  size: 700,
  category: [],
  values: [],
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
    const { width, height, size, values, category } = this.state;

    return (
      <div className="dought" style={{height: size}}>
        <DoughnutChart size={size} category={category} values={values} />
      </div>
    );
  }
}

export default VisualChart;
