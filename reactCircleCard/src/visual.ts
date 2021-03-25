"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import PrimitiveValue = powerbi.PrimitiveValue;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

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
  private selectionManager: ISelectionManager;
  private host: IVisualHost;
  private category: DataViewCategoryColumn;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(RadarChart, {});
    this.target = options.element;
    this.host = options.host;
    this.selectionManager = options.host.createSelectionManager();

    this.clickPoint = this.clickPoint.bind(this);

    ReactDOM.render(this.reactRoot, this.target);
  }

  clickPoint(col) {
    const categorySelectionId = this.host
      .createSelectionIdBuilder()
      .withCategory(this.category, col.id)
      .createSelectionId();

    console.log(categorySelectionId);

    this.selectionManager.select(categorySelectionId);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.viewport = options.viewport;

      const width = this.viewport.width;
      const height = this.viewport.height;
      const size = Math.min(this.viewport.height, this.viewport.width);

      this.category = options.dataViews[0].categorical.categories[0];
      const values = options.dataViews[0].categorical.values[0];

      const _category: string[] = this.category.values.map(
        (value: PrimitiveValue) => value.toString()
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
        x: 0,
        y: 0,
        clickPoint: this.clickPoint,
      });
    }
  }
}
