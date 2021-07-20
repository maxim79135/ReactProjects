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

  public update(options: VisualUpdateOptions) {
    if (options.dataViews && options.dataViews[0]) {
      this.viewport = options.viewport;
      this.settings = VisualSettings.parse<VisualSettings>(
        options.dataViews[0]
      );
      const width = this.viewport.width;
      const height = this.viewport.height;
      Card.update({
        width: width,
        height: height,
        numberOfCards: this.settings.cardChard.numberOfCards,
        margin: this.settings.cardChard.margin,
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
