import * as React from "react";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "svg-pan-zoom-container";
import LineAxes from "./LineAxes";
import PointCaptions from "./PointCaptions";
import PointShape from "./PointShape";
import CircleAxis from "./CircleAxis";

import { polarToX, polarToY } from "./functions";

export interface State {
  width: number;
  height: number;
  size: number;
  category: string[];
  values: string[];
  x?: number;
  y?: number;
  clickPoint?: (col) => void;
}

const initialState: State = {
  width: 480,
  height: 480,
  size: 700,
  category: [],
  values: [],
  x: 0,
  y: 0,
};

class RadarChart extends React.Component {
  state: State = initialState;
  points = (points) => {
    return points
      .map((point) => point[0].toFixed(4) + "," + point[1].toFixed(4))
      .join(" ");
  };

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  _onMouseMove(e) {
    this.setState({ x: e.screenX, y: e.screenY });
  }

  pathDefinition(points: number[][]) {
    let d = "M" + points[0][0].toFixed(4) + "," + points[0][1].toFixed(4);
    for (let i = 1; i < points.length; i++) {
      d += "L" + points[i][0].toFixed(4) + "," + points[i][1].toFixed(4);
    }
    return d + "z";
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
    const scales = [];

    const numberOfScales = 5;
    const {
      width,
      height,
      size,
      values,
      category,
      x,
      y,
      clickPoint,
    } = this.state;
    const valuesMap = [];
    const _map = {};
    category.map((v, i) => (_map[v] = Number(values[i])));
    valuesMap.push(_map);
    const _values = values.map((x) => +x);
    const maxValue: number = Math.max.apply(null, _values);

    const textValue = () => (col) => (
      <text
        key={`caption-of-${col.key}`}
        x={polarToX(
          col.angle,
          (((size / 2) * col.value) / maxValue) * 0.9
        ).toFixed(4)}
        y={polarToY(
          col.angle,
          (((size / 2) * col.value) / maxValue) * 0.9
        ).toFixed(4)}
        dy={10 / 2}
        fill="#444"
        fontWeight="400"
      >
        {col.value.toFixed(2)}
      </text>
    );

    const middleOfChart = (size / 2).toFixed(4);

    const test = category.map((v, i) => {
      return {
        category: v,
        value: values[i],
      };
    });
    test.sort((a, b) => {
      return a.category > b.category ? 1 : -1;
    });
    const new_cat = test.map((v) => {
      return v.category;
    });
    console.log(new_cat);

    const new_val = test.map((v) => {
      return +v.value;
    });
    console.log(new_val);

    const columns = new_cat.map((key, i, all) => {
      return {
        key,
        angle: (Math.PI * 2 * i) / all.length,
        value: new_val[i],
      };
    });
    groups.push(<CircleAxis size={size} numberOfScales={numberOfScales}/>);
    if (this.state !== initialState) {
      groups.push(<LineAxes columns={columns} size={size} />);
      groups.push(<PointCaptions columns={columns} size={size} />);
      groups.push(<g key={`group-text-values`}>{columns.map(textValue())}</g>);

      groups.push(
        <g key={`groups}`}>
          <path
            key={`shape-0`}
            onMouseMove={this._onMouseMove.bind(this)}
            d={this.pathDefinition(
              columns.map((col, i) => {
                const value = (new_val[i] / maxValue) * 0.9;
                return [
                  polarToX(col.angle, (value * size) / 2),
                  polarToY(col.angle, (value * size) / 2),
                ];
              })
            )}
            stroke={`#edc951`}
            fill={`#edc951`}
            fillOpacity=".5"
            className="shape"
          />
        </g>
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
