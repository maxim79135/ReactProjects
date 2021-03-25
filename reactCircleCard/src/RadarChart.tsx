import * as React from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "svg-pan-zoom-container";
import LineAxes from "./LineAxes";
import PointCaptions from "./PointCaptions";
import PointShape from "./PointShape";
import CircleAxis from "./CircleAxis";
import PointValue from "./PointValue";
import ShapePoliline from "./ShapePoliline";

export interface State {
  width: number;
  height: number;
  size: number;
  category: string[];
  values: string[];
  clickPoint?: (col, multiSelect) => void;
}

const initialState: State = {
  width: 480,
  height: 480,
  size: 700,
  category: [],
  values: [],
};

class RadarChart extends React.Component {
  state: State = initialState;

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof RadarChart.updateCallback == "function") {
      RadarChart.updateCallback(newState);
    }
  }

  public componentWillMount() {
    RadarChart.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    RadarChart.updateCallback = null;
  }

  render() {
    const groups = [];

    const numberOfScales = 5;
    const { width, height, size, values, category, clickPoint } = this.state;

    const maxValue: number = Math.max.apply(
      null,
      values.map((x) => +x)
    );

    const middleOfChart = (size / 2).toFixed(4);

    const test = category.map((v, i) => {
      return {
        category: v,
        value: values[i],
        id: i,
      };
    });
    test.sort((a, b) => {
      return a.category > b.category ? 1 : -1;
    });
    const new_cat = test.map((v) => {
      return {
        category: v.category,
        id: v.id,
      };
    });

    const new_val = test.map((v) => {
      return +v.value;
    });
    console.log(new_val);

    const columns = new_cat.map((key, i, all) => {
      return {
        key: key.category,
        angle: (Math.PI * 2 * i) / all.length,
        value: new_val[i],
        id: key.id,
      };
    });
    if (this.state !== initialState) {
      groups.push(<CircleAxis size={size} numberOfScales={numberOfScales} />);
      groups.push(<LineAxes columns={columns} size={size} />);
      groups.push(<PointCaptions columns={columns} size={size} />);
      groups.push(
        <PointValue columns={columns} size={size} maxValue={maxValue} />
      );
      groups.push(
        <ShapePoliline
          columns={columns}
          size={size}
          maxValue={maxValue}
          values={new_val}
        />
      );
      groups.push(
        <PointShape
          columns={columns}
          size={size}
          maxValue={maxValue}
          clickPoint={clickPoint}
        />
      );
    }

    return (
      <div
        data-zoom-on-wheel="zoom-amount: 0.001; min-scale: 0.3; max-scale: 20;"
        data-pan-on-drag="button: left;"
      >
        <svg
          version="1"
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={`0 0 ${size} ${size}`}
          className="main"
        >
          <g transform={`translate(${middleOfChart},${middleOfChart})`}>
            {groups}
          </g>
        </svg>
      </div>
    );
  }
}

export default RadarChart;
