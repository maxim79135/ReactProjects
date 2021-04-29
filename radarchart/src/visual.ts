"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import IViewPort = powerbi.IViewport;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import DataViewValueColumns = powerbi.DataViewValueColumns;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import ISelectionId = powerbi.visuals.ISelectionId;

import {
  createTooltipServiceWrapper,
  ITooltipServiceWrapper,
} from "powerbi-visuals-utils-tooltiputils";

import { VisualSettings } from "./settings";
import * as React from "react";
import * as ReactDOM from "react-dom";

import VisualChart from "./VisualChart";

export class Visual implements IVisual {
  private settings: VisualSettings;
  private target: HTMLElement;
  private viewport: IViewPort;
  private reactRoot: React.ComponentElement<any, any>;
  private category: DataViewCategoryColumn;
  private values: DataViewValueColumns;
  private selectionManager: ISelectionManager;
  private host: IVisualHost;
  private chartData = [];
  private tooltipServiceWrapper: ITooltipServiceWrapper;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(VisualChart, {});
    this.target = options.element;
    this.host = options.host;
    this.selectionManager = options.host.createSelectionManager();

    this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      options.element
    );

    this.clickLegend = this.clickLegend.bind(this);
    ReactDOM.render(this.reactRoot, this.target);
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.viewport = options.viewport;
      this.settings = VisualSettings.parse<VisualSettings>(
        options.dataViews[0]
      );

      const width = this.viewport.width;
      const height = this.viewport.height;
      const size = Math.min(height, width);
      this.category = options.dataViews[0].categorical.categories[0];
      this.values = options.dataViews[0].categorical.values;
      this.chartData = [];

      var countTooltipData = 0;
      this.category.values.map((v, i) => {
        this.chartData.push({
          category: v,
          id: i,
          nameOfValues: this.values
            .filter((v) => v.source.roles["measure"])
            .map((v) => {
              if (v.source.groupName !== undefined) return v.source.groupName;
              else return v.source.displayName;
            }),
          colors: this.values
            .filter((v) => v.source.roles["measure"])
            .map((v, index) => {
              if (v.source.groupName === undefined)
                return this.settings.dataPoint.defaultColor;
              else
                return this.host.colorPalette.getColor((index + 1).toString());
            }),
          nameOfTooltips: this.values
            .filter((v) => v.source.roles["tooltip"])
            .map((v) => v.source.displayName),
        });
        this.values
          .filter((v) => v.source.roles["measure"])
          .map((v) => {
            const new_value = Number(
              Number(v.values[i]).toFixed(this.settings.shape.numberOfDigits)
            );

            if (v.source.groupName !== undefined)
              return (this.chartData[i][
                v.source.groupName.toString()
              ] = new_value);
            else
              return (this.chartData[i][
                v.source.displayName.toString()
              ] = new_value);
          });
        this.values
          .filter((v) => v.source.roles["tooltip"])
          .map(
            (v) =>
              (this.chartData[i][v.source.displayName.toString()] = v.values[i])
          );
      });
      console.log(this.chartData);

      this.chartData.sort((a, b) => {
        if (a.category > b.category) return 1;
        else return -1;
        // const [name_a, value_a] = String(a.category).split("-");
        // const [name_b, value_b] = String(a.category).split("-");
        // if (name_a > name_b && Number(value_a) > Number(value_b)) return 1;
        // if (name_a.length == name_b.length) {
        //   if (Number(value_a) > Number(value_b)) return 1;
        //   else return -1;
        // } else return -1;
      });

      VisualChart.update({
        width: width,
        height: height,
        size: size,
        chartData: this.chartData,
        clickLegend: this.clickLegend,
        countTooltipData: countTooltipData,
        colors: this.chartData[0].colors,
        settings: this.settings,
      });
    }
  }

  clickLegend(col, multiSelect) {
    const categorySelectionId = this.host
      .createSelectionIdBuilder()
      .withCategory(this.category, col)
      .createSelectionId();
    this.selectionManager.select(categorySelectionId, multiSelect);
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
    // if (!this.settings || !this.chartData) return [];

    // const dataPointSettings = this.settings.dataPoint;

    // let instances: VisualObjectInstance[] = [
    //   {
    //     objectName: "dataPoint",
    //     displayName: "Data colors",
    //     selector: null,
    //     properties: {
    //       defaultColor: dataPointSettings.defaultColor,
    //       showAllDataPoints: dataPointSettings.showAllDataPoints,
    //     },
    //   },
    // ];

    // if (!dataPointSettings.showAllDataPoints) return instances;

    // this.chartData[0].colors.map((v, i) => {
    //   let colorInstance: VisualObjectInstance = {
    //     objectName: "datapoint",
    //     displayName: "Data colors",
    //     selector: null,
    //     properties: {
    //       fill: { solid: { color: v.value } },
    //     },
    //   };
    //   instances.push(colorInstance);
    // });

    // console.log(instances);

    // return instances;
  }
}
