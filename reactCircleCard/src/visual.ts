"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import PrimitiveValue = powerbi.PrimitiveValue;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;

import "./../style/visual.less";

import * as React from "react";
import * as ReactDOM from "react-dom";
import IViewPort = powerbi.IViewport;

import RadarChart from "./RadarChart";
import { values } from "d3";

export class Visual implements IVisual {
  private target: HTMLElement;
  private viewport: IViewPort;
  private reactRoot: React.ComponentElement<any, any>;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(RadarChart, {});
    this.target = options.element;

    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.viewport = options.viewport;

      const width = this.viewport.width;
      const height = this.viewport.height;
      const size = Math.min(this.viewport.height, this.viewport.width);

      const category: DataViewCategoryColumn =
        options.dataViews[0].categorical.categories[0];
      const values = options.dataViews[0].categorical.values[0];

      const _category: string[] = category.values.map((value: PrimitiveValue) =>
        value.toString()
      );

      const _values: string[] = values.values.map((value: PrimitiveValue) =>
        value.toString()
      );

      RadarChart.update({
        width: width,
        height: height,
        size: size,
        category: _category,
        values: _values,
      });
    }
  }
}
