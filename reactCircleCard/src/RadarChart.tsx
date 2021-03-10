import * as React from "react";
import "svg-pan-zoom-container";

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

class RadarChart extends React.Component {
  state: State = initialState;
  //   data = [
  //     { battery: 0.7, design: 0.5, useful: 0.9, speed: 0.67, weight: 0.8 },
  //     { battery: 0.6, design: 0.9, useful: 0.8, speed: 0.7, weight: 0.6 },
  //   ];

  polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;
  polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;

  points = (points) => {
    return points
      .map((point) => point[0].toFixed(4) + "," + point[1].toFixed(4))
      .join(" ");
  };

  constructor(props) {
    super(props);
    this.state = initialState;
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
    const { width, height, size, values, category } = this.state;
    const valuesMap = [];
    const _map = {};
    category.map((v, i) => (_map[v] = Number(values[i])));
    valuesMap.push(_map);
    const _values = values.map((x) => +x);
    const maxValue: number = Math.max.apply(null, _values);

    const scale = (value) => (
      <circle
        key={`scale-${value}`}
        cx={0}
        cy={0}
        r={((value / numberOfScales) * size) / 2}
        fill="#FAFAFA"
        stroke="#999"
        strokeWidth="0.2"
      />
    );

    const axis = () => (col, i) => (
      <polyline
        key={`poly-axis-${i}`}
        points={this.points([
          [0, 0],
          [
            this.polarToX(col.angle, size / 2),
            this.polarToY(col.angle, size / 2),
          ],
        ])}
        stroke="#555"
        strokeWidth=".2"
      />
    );

    const caption = () => (col) => (
      <text
        key={`caption-of-${col.key}`}
        x={this.polarToX(col.angle, (size / 2) * 0.95).toFixed(4)}
        y={this.polarToY(col.angle, (size / 2) * 0.95).toFixed(4)}
        dy={10 / 2}
        fill="#444"
        fontWeight="400"
      >
        {col.key}
      </text>
    );

    const textValue = () => (col) => (
        <text
          key={`caption-of-${col.key}`}
          x={this.polarToX(col.angle, (size / 2) * col.value / maxValue * 0.9).toFixed(4)}
          y={this.polarToY(col.angle, (size / 2) * col.value / maxValue * 0.9).toFixed(4)}
          dy={10 / 2}
          fill="#444"
          fontWeight="400"
        >
          {(col.value).toFixed(2)}
        </text>
      );

    for (let i = numberOfScales; i > 0; i--) {
      scales.push(scale(i));
    }
    groups.push(<g key={`scales`}>{scales}</g>);

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
        value: new_val[i]
      };
    });

    if (this.state !== initialState) {
      groups.push(<g key={`group-axes`}>{columns.map(axis())}</g>);
      groups.push(<g key={`group-captions`}>{columns.map(caption())}</g>);
      groups.push(<g key={`group-text-values`}>{columns.map(textValue())}</g>);
      groups.push(
        <g key={`groups}`}>
          <path
            key={`shape-0`}
            d={this.pathDefinition(
              columns.map((col, i) => {
                const value = new_val[i] / maxValue * 0.9;
                return [
                  this.polarToX(col.angle, (value * size) / 2),
                  this.polarToY(col.angle, (value * size) / 2),
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
