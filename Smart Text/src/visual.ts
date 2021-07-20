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
//import "core-js/stable";
import "./../style/visual.less";
import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;

import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
import { getValue } from "./objectEnumerationUtility";
import {
  prepareMeasureText,
  getMeasureColor,
  getTextParts,
} from "./smartTextUtility";
import Fill = powerbi.Fill;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;

/* export function logExceptions(): MethodDecorator {
    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>)
        : TypedPropertyDescriptor<any> {

        return {
            value: function () {
                try {
                    return descriptor.value.apply(this, arguments);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            }
        }
    }
} */

interface SmartTextVisualSettings {
  textSettings: {
    pattern: string;
    fontColor: Fill;
    fontSize: number;
    fontFamily: string;
    alignment: string;
    isBold: boolean;
    isItalic: boolean;
  };
  dataLabels: {
    currentMeasureIndex: number;
    currentMeasureName: string;
    dontShowBlankAndNaN: boolean;
    blankAndNaNReplaceText: string;
    fontSize: number;
    isBold: boolean;
    isItalic: boolean;
    displayUnit: number;
    precision: number;
    addPlusforPositiveValue: boolean;
    dataLabelCondition1: string;
    dataLabelCondition2: string;
    dataLabelCondition3: string;
    dataLabelColor1: Fill;
    dataLabelColor2: Fill;
    dataLabelColor3: Fill;
    prefix1: string;
    prefix2: string;
    prefix3: string;
    postfix1: string;
    postfix2: string;
    postfix3: string;
    queryName: string;
    isNumeric: boolean;
  };
  measureSettings: SmartTextMeasureSettings[];
}

interface SmartTextMeasureSettings {
  measureText: string;
  measureColor: Fill;
  measureFontSize: number;
  isBold: boolean;
  isItalic: boolean;
}

function visualTransform(
  options: VisualUpdateOptions,
  host: IVisualHost,
  lastMeasureIndex: number
): SmartTextVisualSettings {
  let dataViews = options.dataViews;

  let objects = dataViews[0].metadata.objects;
  let tableColumns: DataViewMetadataColumn[] = dataViews[0].table.columns;
  let measureSetting: SmartTextMeasureSettings;
  let measureSettings: SmartTextMeasureSettings[] = [];

  for (let i = 0; i < tableColumns.length; i++) {
    measureSetting = {
      measureText: prepareMeasureText(dataViews[0].table, i, host.locale),
      measureColor: getMeasureColor(dataViews[0].table, i),
      measureFontSize: getValue<number>(
        tableColumns[i].objects,
        "dataLabels",
        "fontSize",
        8
      ),
      isBold: getValue<boolean>(
        tableColumns[i].objects,
        "dataLabels",
        "isBold",
        false
      ),
      isItalic: getValue<boolean>(
        tableColumns[i].objects,
        "dataLabels",
        "isItalic",
        false
      ),
    };
    measureSettings.push(measureSetting);
  }

  let currentMeasureIndex: number = getValue<number>(
    objects,
    "dataLabels",
    "currentMeasureIndex",
    1
  );

  if (currentMeasureIndex > tableColumns.length || currentMeasureIndex == 0)
    currentMeasureIndex = lastMeasureIndex;
  if (currentMeasureIndex > tableColumns.length) currentMeasureIndex = 1;

  let settings = {
    textSettings: {
      pattern: getValue<string>(objects, "textSettings", "pattern", ""),
      fontColor: getValue<Fill>(objects, "textSettings", "fontColor", {
        solid: { color: "#333" },
      }),
      fontSize: getValue<number>(objects, "textSettings", "fontSize", 8),
      fontFamily: getValue<string>(
        objects,
        "textSettings",
        "fontFamily",
        "wf_standard-font,helvetica,arial,sans-serif"
      ),
      alignment: getValue<string>(objects, "textSettings", "alignment", "left"),
      isBold: getValue<boolean>(objects, "textSettings", "isBold", false),
      isItalic: getValue<boolean>(objects, "textSettings", "isItalic", false),
    },
    dataLabels: {
      currentMeasureIndex: currentMeasureIndex,
      currentMeasureName: tableColumns[currentMeasureIndex - 1].displayName,
      dontShowBlankAndNaN: getValue<boolean>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dontShowBlankAndNaN",
        false
      ),
      blankAndNaNReplaceText: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "blankAndNaNReplaceText",
        ""
      ),
      fontSize: getValue<number>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "fontSize",
        8
      ),
      isBold: getValue<boolean>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "isBold",
        false
      ),
      isItalic: getValue<boolean>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "isItalic",
        false
      ),
      displayUnit: getValue<number>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "displayUnit",
        0
      ),
      precision: getValue<number>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "precision",
        null
      ),
      addPlusforPositiveValue: getValue<boolean>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "addPlusforPositiveValue",
        false
      ),
      dataLabelCondition1: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelCondition1",
        ""
      ),
      dataLabelColor1: getValue<Fill>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelColor1",
        null
      ),
      prefix1: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "prefix1",
        ""
      ),
      postfix1: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "postfix1",
        ""
      ),
      dataLabelCondition2: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelCondition2",
        ""
      ),
      dataLabelColor2: getValue<Fill>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelColor2",
        null
      ),
      prefix2: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "prefix2",
        ""
      ),
      postfix2: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "postfix2",
        ""
      ),
      dataLabelCondition3: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelCondition3",
        ""
      ),
      dataLabelColor3: getValue<Fill>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "dataLabelColor3",
        null
      ),
      prefix3: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "prefix3",
        ""
      ),
      postfix3: getValue<string>(
        tableColumns[currentMeasureIndex - 1].objects,
        "dataLabels",
        "postfix3",
        ""
      ),
      queryName: tableColumns[currentMeasureIndex - 1].queryName,
      isNumeric:
        tableColumns[currentMeasureIndex - 1].type.numeric ||
        tableColumns[currentMeasureIndex - 1].type.integer,
    },
    measureSettings: measureSettings,
  };
  return settings;
}

("use strict");
export class Visual implements IVisual {
  private lastMeasureIndex: number;
  private settings: SmartTextVisualSettings;
  private host: IVisualHost;
  private dataView: DataView;
  private target: HTMLElement;

  constructor(options: VisualConstructorOptions) {
    this.lastMeasureIndex = 1;
    this.host = options.host;
    options.element.style.cursor = "default";

    if (typeof document !== "undefined") {
      this.target = options.element.appendChild(document.createElement("p"));
      this.target.style.minWidth = "100px";
      this.target.style.minHeight = "100%";
      this.target.style.overflow = "auto";
      this.target.style.margin = "0";
    }
  }

  // @logExceptions()
  public update(options: VisualUpdateOptions) {
    //Smart Text code
    this.dataView = options.dataViews[0];
    this.settings = visualTransform(options, this.host, this.lastMeasureIndex);
    this.lastMeasureIndex = this.settings.dataLabels.currentMeasureIndex;

    let pattern = this.settings.textSettings.pattern;
    let measureSettings = this.settings.measureSettings;

    if (typeof document !== "undefined" && this.target !== null) {
      this.SetSize(options);
      let paragraph = document.createElement("p");

      if (pattern !== null && pattern !== "") {
        let textParts = getTextParts(pattern, measureSettings.length);
        for (let i = 0; i < textParts.length; i++) {
          let index = textParts[i].measureIndex;
          if (index == null) {
            let textSplit = textParts[i].text.split("\\n");
            if (textSplit.length > 0) {
              let label = document.createElement("label");
              for (let j = 0; j < textSplit.length; j++) {
                label.appendChild(document.createTextNode(textSplit[j]));
                if (j + 1 < textSplit.length)
                  label.appendChild(document.createElement("br"));
              }
              paragraph.appendChild(label);
            }
          } else {
            if (index > 0 && index <= measureSettings.length) {
              let label = document.createElement("label");
              index = index - 1;
              label.appendChild(
                document.createTextNode(measureSettings[index].measureText)
              );
              label.style.fontWeight =
                measureSettings[index].isBold == true ? "bold" : "normal";
              label.style.fontStyle =
                measureSettings[index].isItalic == true ? "italic" : "normal";
              if (measureSettings[index].measureFontSize > 8)
                label.style.fontSize =
                  measureSettings[index].measureFontSize.toString() + "pt";
              if (measureSettings[index].measureColor !== null)
                label.style.color =
                  measureSettings[index].measureColor.solid.color;
              paragraph.appendChild(label);
            }
          }
        }
      }
      this.target.innerHTML = paragraph.innerHTML;
      this.target.style.textAlign = this.settings.textSettings.alignment;
      this.target.style.fontFamily = this.settings.textSettings.fontFamily;
      this.target.style.fontSize =
        this.settings.textSettings.fontSize.toString() + "pt";
      this.target.style.color =
        this.settings.textSettings.fontColor.solid.color;
      this.target.style.fontWeight =
        this.settings.textSettings.isBold == true ? "bold" : "normal";
      this.target.style.fontStyle =
        this.settings.textSettings.isItalic == true ? "italic" : "normal";
    }
  }

  public SetSize(options: VisualUpdateOptions): void {
    let width = Math.max(options.viewport.width - 5);
    let height = Math.max(options.viewport.height - 5);
    this.target.style.width = width.toString() + "px";
    this.target.style.height = height.toString() + "px";
  }

  /**
   * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the
   * objects and properties you want to expose to the users in the property pane.
   *
   */
  public enumerateObjectInstances(
    options: EnumerateVisualObjectInstancesOptions
  ): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
    let objectName = options.objectName;
    let objectEnumeration: VisualObjectInstance[] = [];

    switch (objectName) {
      case "textSettings":
        objectEnumeration.push({
          objectName: objectName,
          properties: {
            pattern: this.settings.textSettings.pattern,
            fontColor: this.settings.textSettings.fontColor,
            fontSize: this.settings.textSettings.fontSize,
            fontFamily: this.settings.textSettings.fontFamily,
            alignment: this.settings.textSettings.alignment,
            isBold: this.settings.textSettings.isBold,
            isItalic: this.settings.textSettings.isItalic,
          },
          selector: null,
        });
        break;

      case "dataLabels":
        objectEnumeration.push({
          objectName: objectName,
          properties: {
            currentMeasureIndex: this.settings.dataLabels.currentMeasureIndex,
            currentMeasureName: this.settings.dataLabels.currentMeasureName,
          },
          selector: null,
        });
        if (this.settings.dataLabels.isNumeric)
          objectEnumeration.push({
            objectName: objectName,
            properties: {
              displayUnit: this.settings.dataLabels.displayUnit,
              precision: this.settings.dataLabels.precision,
              addPlusforPositiveValue:
                this.settings.dataLabels.addPlusforPositiveValue,
            },
            selector: { metadata: this.settings.dataLabels.queryName },
          });
        objectEnumeration.push({
          objectName: objectName,
          properties: {
            dontShowBlankAndNaN: this.settings.dataLabels.dontShowBlankAndNaN,
          },
          selector: { metadata: this.settings.dataLabels.queryName },
        });
        if (this.settings.dataLabels.dontShowBlankAndNaN)
          objectEnumeration.push({
            objectName: objectName,
            properties: {
              blankAndNaNReplaceText:
                this.settings.dataLabels.blankAndNaNReplaceText,
            },
            selector: { metadata: this.settings.dataLabels.queryName },
          });

        objectEnumeration.push({
          objectName: objectName,
          properties: {
            fontSize: this.settings.dataLabels.fontSize,
            isBold: this.settings.dataLabels.isBold,
            isItalic: this.settings.dataLabels.isItalic,
            dataLabelCondition1: this.settings.dataLabels.dataLabelCondition1,
            dataLabelColor1: this.settings.dataLabels.dataLabelColor1,
            prefix1: this.settings.dataLabels.prefix1,
            postfix1: this.settings.dataLabels.postfix1,
            dataLabelCondition2: this.settings.dataLabels.dataLabelCondition2,
            dataLabelColor2: this.settings.dataLabels.dataLabelColor2,
            prefix2: this.settings.dataLabels.prefix2,
            postfix2: this.settings.dataLabels.postfix2,
            dataLabelCondition3: this.settings.dataLabels.dataLabelCondition3,
            dataLabelColor3: this.settings.dataLabels.dataLabelColor3,
            prefix3: this.settings.dataLabels.prefix3,
            postfix3: this.settings.dataLabels.postfix3,
          },
          selector: { metadata: this.settings.dataLabels.queryName },
        });

        break;
      case "about":
        objectEnumeration.push({
          objectName: objectName,
          properties: {
            version: "1.3.2",
          },
          selector: null,
        });
        break;
    }
    return objectEnumeration;
  }
}
