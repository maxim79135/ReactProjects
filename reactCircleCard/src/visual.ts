"use strict";
import powerbi from "powerbi-visuals-api";

import DataView = powerbi.DataView;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import PrimitiveValue = powerbi.PrimitiveValue;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import ISelectionId = powerbi.extensibility.ISelectionId;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;

import "./../style/visual.less";

import * as React from "react";
import * as ReactDOM from "react-dom";
import IViewPort = powerbi.IViewport;

import RadarChart from "./RadarChart";
import { VisualSettings } from "./settings";

export class Visual implements IVisual {
  private target: HTMLElement;
  private viewport: IViewPort;
  private reactRoot: React.ComponentElement<any, any>;
  private selectionManager: ISelectionManager;
  private host: IVisualHost;
  private category: DataViewCategoryColumn;
  private visualSettings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(RadarChart, {});
    this.target = options.element;
    this.host = options.host;
    this.selectionManager = options.host.createSelectionManager();

    this.clickPoint = this.clickPoint.bind(this);
    this.selectionManager.registerOnSelectCallback(() => {
      this.syncSelectionState(
        this.category,
        <ISelectionId[]>this.selectionManager.getSelectionIds()
      );
    });

    ReactDOM.render(this.reactRoot, this.target);
  }

  private syncSelectionState(category, selectionIds: ISelectionId[]): void {
    if (!category || !selectionIds) return;
    if (!selectionIds.length) return;
    console.log(selectionIds);
  }

  clickPoint(col, multiSelect) {
    const categorySelectionId = this.host
      .createSelectionIdBuilder()
      .withCategory(this.category, col.id)
      .createSelectionId();
    this.selectionManager.select(categorySelectionId, multiSelect);
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstanceEnumeration {
    const settings: VisualSettings =
      this.visualSettings || <VisualSettings>VisualSettings.getDefault();
    return VisualSettings.enumerateObjectInstances(settings, options);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.updateVisualProperties(options);

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

      this.syncSelectionState(
        this.category,
        <ISelectionId[]>this.selectionManager.getSelectionIds()
      );

      RadarChart.update({
        width: width,
        height: height,
        size: size,
        color: this.visualSettings.radarChart.pointColor,
        category: _category,
        values: _values,
        clickPoint: this.clickPoint,
        numberOfScales: this.visualSettings.radarChart.numberOfScale,
      });
    }
  }

  protected updateVisualProperties(options: VisualUpdateOptions) {
    this.visualSettings = VisualSettings.parse<VisualSettings>(
      options.dataViews[0]
    );
  }

  protected static parseSettings(dataView: DataView): VisualSettings {
    return VisualSettings.parse(dataView) as VisualSettings;
  }
}
