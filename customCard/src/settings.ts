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

import { dataViewObjectsParser } from "powerbi-visuals-utils-dataviewutils";
import DataViewObjectsParser = dataViewObjectsParser.DataViewObjectsParser;

export class MainMeasureSettings {
  public color: string = "#333333";
  public displayUnit: number = 0;
  public decimalPlaces: number = 0;
  public textSize: number = 27;
  public fontFamily: string = "wf_standard-font, helvetica, arial, sans-serif";
}

export class CategorySettings {
  public show: boolean = true;
  public horizontalAlignment: string = "center";
  public paddingTop: number = 5;
  public color: string = "#333333";
  public textSize: number = 27;
  public fontFamily: string = "wf_standard-font, helvetica, arial, sans-serif";
  public wordWrap: boolean = true;
  public defaultTitle: string = "";
}

export class MultipleCardsSettings {
  public cardsPerRow: number = 5;
  public spaceBetweenCards: number = 15;
  public spaceBeforeFirstComponent: number = 15;
  public spaceBetweenCardComponent: number = 15;
}

export class VisualSettings extends DataViewObjectsParser {
  public mainMeasureSettings: MainMeasureSettings = new MainMeasureSettings();
  public categorySettings: CategorySettings = new CategorySettings();
  public multipleCardsSettings: MultipleCardsSettings =
    new MultipleCardsSettings();
}
