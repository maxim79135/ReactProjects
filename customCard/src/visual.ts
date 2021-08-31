/*
 *  Power BI Visualizations
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

import { VisualSettings } from "./settings";
import * as React from "react";
import * as ReactDOM from "react-dom";

import Card from "./Card";

export class Visual implements IVisual {
  private settings: VisualSettings;
  private reactRoot: React.ComponentElement<any, any>;
  private target: HTMLElement;
  private viewport: IViewPort;
  private visualSettings: VisualSettings;

  constructor(options: VisualConstructorOptions) {
    this.reactRoot = React.createElement(Card, {});
    this.target = options.element;
    ReactDOM.render(this.reactRoot, this.target);
  }

  getMeasureValues(
    values: powerbi.DataViewValueColumns,
    nameOfRole: string
  ): Array<Number> {
    let measure: Array<Number> = [];
    values.forEach((v) => {
      if (v.source.roles[nameOfRole])
        measure = v.values.map((v_) => Number(v_));
    });
    return measure;
  }

  getAdditionalCategoryValues(
    values: powerbi.DataViewValueColumns,
    nameOfRole: string[]
  ): Array<string> {
    let additionalCategory: Array<string> = [];
    nameOfRole.forEach((name) => {
      let flag: boolean = false;
      values.forEach((v, i) => {
        if (v.source.roles[name]) {
          additionalCategory.push(v.source.displayName);
          flag = true;
        }
      });
      if (!flag) additionalCategory.push("");
    });
    return additionalCategory;
  }

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.viewport = options.viewport;
      this.settings = VisualSettings.parse<VisualSettings>(
        options.dataViews[0]
      );

      const width: number = this.viewport.width;
      const height: number = this.viewport.height;
      const settings: VisualSettings = this.settings;

      let category: Array<string>;
      if (options.dataViews[0].categorical.categories === undefined) {
        category = [settings.categoryMainMeasureSettings.defaultTitle];
      } else {
        category = options.dataViews[0].categorical.categories[0].values.map(
          (v) => v.toString()
        );
      }

      let additionalCategory: Array<string> = this.getAdditionalCategoryValues(
        options.dataViews[0].categorical.values,
        ["measure_comparison_1", "measure_comparison_2", "measure_comparison_3"]
      );

      let main_measure: Array<Number> = this.getMeasureValues(
        options.dataViews[0].categorical.values,
        "main_measure"
      );

      const measure_comparison_1: Array<Number> = this.getMeasureValues(
        options.dataViews[0].categorical.values,
        "measure_comparison_1"
      );
      const measure_comparison_2: Array<Number> = this.getMeasureValues(
        options.dataViews[0].categorical.values,
        "measure_comparison_2"
      );
      const measure_comparison_3: Array<Number> = this.getMeasureValues(
        options.dataViews[0].categorical.values,
        "measure_comparison_3"
      );
      const additionalMeasures = [
        { name: "measure_comparison_1", values: measure_comparison_1 },
        { name: "measure_comparison_2", values: measure_comparison_2 },
        { name: "measure_comparison_3", values: measure_comparison_3 },
      ];

      Card.update({
        width: width,
        height: height,
        settings: settings,
        category: category,
        main_measure: main_measure,
        additionalMeasures: additionalMeasures,
        additionalCategory: additionalCategory,
      });
    }
  }

  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    return VisualSettings.enumerateObjectInstances(
      this.settings || VisualSettings.getDefault(),
      options
    );
  }
}
