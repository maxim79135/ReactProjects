/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
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
import PrimitiveValue = powerbi.PrimitiveValue;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

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
  private selectionManager: ISelectionManager;
  private host: IVisualHost;
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

      const width = this.viewport.width;
      const height = this.viewport.height;
      const size = Math.min(height, width);
      var countTooltipData = 0;
      var tooltipData = [];

      this.category = options.dataViews[0].categorical.categories[0];
      const values = options.dataViews[0].categorical.values[0];

      const _category = this.category.values.map((value) => value.toString());
      const _values = values.values.map((value) => value.toString());
      const maxValue = options.dataViews[0].categorical.values[0].maxLocal;

      countTooltipData = options.dataViews[0].categorical.values.length - 1;
      if (countTooltipData < 0) countTooltipData = 0;
      for (let i = 0; i < countTooltipData; i++) {
        tooltipData.push({
          name:
            options.dataViews[0].categorical.values[i + 1].source.displayName,
          values: options.dataViews[0].categorical.values[i + 1].values
            .map((v, i) => {
              return {
                category: _category[i],
                value: v,
                id: i,
              };
            })
            .sort((a, b) => (a.category > b.category ? 1 : -1)),
        });
      }

      // this.tooltipServiceWrapper.addTooltip()

      VisualChart.update({
        width: width,
        height: height,
        size: size,
        category: _category,
        values: _values,
        clickLegend: this.clickLegend,
        countTooltipData: countTooltipData,
        tooltipData: tooltipData,
        maxValue: maxValue,
      });

      console.log(this.reactRoot);
    }
  }

  clickLegend(col, multiSelect) {
    const categorySelectionId = this.host
      .createSelectionIdBuilder()
      .withCategory(this.category, col)
      .createSelectionId();
    this.selectionManager.select(categorySelectionId, multiSelect);
  }

  private static parseSettings(dataView: DataView): VisualSettings {
    return <VisualSettings>VisualSettings.parse(dataView);
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
  }
}
