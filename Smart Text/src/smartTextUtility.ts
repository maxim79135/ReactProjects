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
  
  import powerbi from "powerbi-visuals-api";
  import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
  import DataViewTable = powerbi.DataViewTable;
  import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
  import {getValue} from "./objectEnumerationUtility";
  import Fill = powerbi.Fill;
  
  interface ConditionPart {
    value: number;
    isMeasure: boolean}

  interface TextPart {
    text: string;
    measureIndex: number}
  
  interface MeasureTag {
    start: number;
    end: number;
    measureIndex: number
  } 
  
  function formatMeasure(data, properties) {
    const formatter = valueFormatter.create(properties);
    return formatter.format(data);
  }

  const localizedUnits = {
    "ru-RU_K": " тыс.",
    "ru-RU_M": " млн",
    "ru-RU_bn": " млрд",
    "ru-RU_T": " трлн"
  }

  function localizeUnit(value: string, unit: string, culture: string): string {
    let localizedUnit = localizedUnits[culture + "_" + unit];
    if(localizeUnit) {
      return value.replace(unit, localizedUnit);
    } else
    return value;
  }

  export function prepareMeasureText(dataTable: DataViewTable, index: number, culture: string ): string {
      
      let currentColumn: DataViewMetadataColumn = dataTable.columns[index];
      let value: any = dataTable.rows[0][index];
      let valueFormatted: string = "";
      let valueType = currentColumn.type;
      let displayUnit = getValue<number>(currentColumn.objects, "dataLabels", "displayUnit", 0);
      let precision = getValue<number>(currentColumn.objects, "dataLabels", "precision", null);
      let addPlusforPositiveValue = getValue<boolean>(currentColumn.objects, "dataLabels", "addPlusforPositiveValue", false);
      let prefix = getConditionProperty(dataTable, index, "prefix").replace("SPACE", ""); 
      let postfix = getConditionProperty(dataTable, index, "postfix").replace("SPACE", "");
      let dontShowBlankAndNaN = getValue<boolean>(currentColumn.objects, "dataLabels", "dontShowBlankAndNaN", false);
      let blankAndNaNReplaceText = getValue<string>(currentColumn.objects, "dataLabels", "blankAndNaNReplaceText", "");
      if(dontShowBlankAndNaN) 
        valueFormatted = blankAndNaNReplaceText;

      if(!(dontShowBlankAndNaN && value == null))
      {
        if (valueType.numeric || valueType.integer) 
        {
          if(!(isNaN(value as number) && dontShowBlankAndNaN))
          {
            valueFormatted = formatMeasure(
              value as number,
              { 
                "format": currentColumn.format,
                "value": displayUnit === 0 ? value as number : displayUnit,
                "precision": precision,
                "allowFormatBeautification": false,
                "cultureSelector": culture
              });
            if(culture != "en-US")
            {
              valueFormatted = localizeUnit(valueFormatted, "K", culture);
              valueFormatted = localizeUnit(valueFormatted, "M", culture);
              valueFormatted = localizeUnit(valueFormatted, "bn", culture);
              valueFormatted = localizeUnit(valueFormatted, "T", culture);
              
            };

            if(addPlusforPositiveValue && value as number > 0) 
              valueFormatted = "+" + valueFormatted;
          }
        }
        else {
          valueFormatted = formatMeasure( 
              valueType.dateTime ? new Date(value as string) : value,
              {
                  "format": currentColumn.format,
                  "cultureSelector": culture
              }
          );
        };
      };
      return prefix + valueFormatted + postfix;
  }
  
  function getConditionByIndex(currentColumn: DataViewMetadataColumn, conditionIndex: number): string {
    
    return getValue<string>(currentColumn.objects, "dataLabels", "dataLabelCondition" + conditionIndex.toString(), null);

  }
  
  function getConditionColorByIndex(currentColumn: DataViewMetadataColumn, conditionIndex: number): Fill {
    
    return getValue<Fill>(currentColumn.objects, "dataLabels", "dataLabelColor" + conditionIndex.toString(), null);

  }

  function haveOperator(condition: string, operator: string): boolean {
    return condition.indexOf(operator) != -1;
  }

  function getNumberFromString(stringData: string): number 
  {
    let result: number = null;
    try {
      if (stringData.indexOf("{") != -1) 
      {
        if (stringData.length >= 3) 
          result = Number(stringData.substr(1, stringData.length - 2));
      }
      else 
      {
          result = Number(stringData);
      }
      if (isNaN(result)) 
          result = null;
      
    } 
    catch (error) 
    {
      result = null;
    }
    return result;
  }

  function getNumberFromMeasureIndex(index: number, dataTable: DataViewTable): number
  {
    let result: number = null;
    if(index != null)
    {
      index = index - 1;
      if(index >= 0 && index < dataTable.columns.length) 
      try 
      {
        result = Number(dataTable.rows[0][index] as string);
        if (isNaN(result)) 
          result = null;
      } catch (error) 
      {
        result = null;
      }
    }
    return result;
  }

  function getConditionPart(condition: string, operator: string, partType: string): ConditionPart
  {
    condition = condition.replace(/\s/g, '');
    let operatorPosition = condition.indexOf(operator);
    let part: string = null;
    if(partType == "left")
    {
      part = condition.substr(0, operatorPosition);
    }
    else
    {
      part = condition.substr(operatorPosition + operator.length, condition.length - operatorPosition - operator.length);
    }
    let conditionPart = {
      value: getNumberFromString(part),
      isMeasure: part.indexOf("{") != -1
    }
    return conditionPart;
  }

 

  function calculateCondition(condition: string, operator: string, dataTable: DataViewTable): boolean
  {
    let leftNumber: number = null;
    let rightNumber: number = null;
    let leftPart = getConditionPart(condition, operator, "left");
    let rightPart = getConditionPart(condition, operator, "right");
    if(leftPart.isMeasure)
    {
      leftNumber = getNumberFromMeasureIndex(leftPart.value, dataTable);
    } 
    else
      leftNumber = leftPart.value;
    if(rightPart.isMeasure)
    {
      rightNumber = getNumberFromMeasureIndex(rightPart.value, dataTable);
    } 
    else
      rightNumber = rightPart.value;
    
    
    if(leftNumber == null || rightNumber == null)
      return false;
    if (operator == "=")
      return leftNumber == rightNumber;
    if (operator == ">=")
      return leftNumber >= rightNumber;
    if (operator == "<=")
      return leftNumber <= rightNumber;
    if (operator == "<>")
      return leftNumber != rightNumber;
    if (operator == ">")
      return leftNumber > rightNumber;
    if (operator == "<")
      return leftNumber < rightNumber;
  }


  
  export function getMeasureColor(dataTable: DataViewTable, index: number ): Fill {
    
    const operators: string[] = ["<>", ">=", "<=", "=", ">", "<"];

    for(let conditionIndex = 1; conditionIndex < 4; conditionIndex++)
    {
      let condition = getConditionByIndex(dataTable.columns[index], conditionIndex);

      if(condition != "" && condition != null)
      {
        for(let operatorIndex = 0; operatorIndex < operators.length; operatorIndex++)
        {
          let operator = operators[operatorIndex];
          if(haveOperator(condition, operator))
          {
            if(calculateCondition(condition, operator, dataTable))
            {
              return getConditionColorByIndex(dataTable.columns[index], conditionIndex);
            };
            break;
          }
        }
      }
    }
    return null;
  }
  
  function getConditionPropertyByIndex(currentColumn: DataViewMetadataColumn, property: string, conditionIndex: number): string {
    
    return getValue<string>(currentColumn.objects, "dataLabels", property + conditionIndex.toString(), "");

  }

  function getConditionProperty(dataTable: DataViewTable, index: number, property: string ): string {
    
    const operators: string[] = ["<>", ">=", "<=", "=", ">", "<"];

    for(let conditionIndex = 1; conditionIndex < 4; conditionIndex++)
    {
      let condition = getConditionByIndex(dataTable.columns[index], conditionIndex);

      if(condition != "" && condition != null)
      {
        for(let operatorIndex = 0; operatorIndex < operators.length; operatorIndex++)
        {
          let operator = operators[operatorIndex];
          if(haveOperator(condition, operator))
          {
            if(calculateCondition(condition, operator, dataTable))
            {
              return getConditionPropertyByIndex(dataTable.columns[index], property, conditionIndex);
            };
            break;
          }
        }
      }
    }
    return "";
  }
  function findMeasureTag(pattern: string, startPosition: number, index: number): MeasureTag
  {
    let searchString = "{" + index.toString() + "}";
    let start = pattern.indexOf(searchString, startPosition);
    if(start != -1)
    {
      return {
        start: start,
        end: start + searchString.length,
        measureIndex: index
      }
    }
    else 
      return null;
    
  }

  function findNearestMeasureTag(pattern: string, startPosition: number, numberOfMeasures: number): MeasureTag
  {
    let nearestTag: MeasureTag = null;

    for(let i = 1; i <= numberOfMeasures; i++)
    {
      let currentTag = findMeasureTag(pattern, startPosition, i);
      if(currentTag != null)
      {
        if(nearestTag == null || currentTag.start <= nearestTag.start)
          nearestTag = currentTag;
      }
    }

    return nearestTag;
  }

  export function getTextParts(pattern: string, numberOfMeasures: number): TextPart[]
  {
      let result: TextPart[] = [];
      let textPart: TextPart;
      let currentPosition = 0;
      let nearestTag: MeasureTag;

      for(; currentPosition < pattern.length;)
      {
        nearestTag = findNearestMeasureTag(pattern, currentPosition, numberOfMeasures);
        if(nearestTag == null)
        {
          result.push({
            text: pattern.substring(currentPosition, pattern.length),
            measureIndex: null
          });
          break;
        }
        else
        {
          if(nearestTag.start > currentPosition)
          {
            result.push({
              text: pattern.substring(currentPosition, nearestTag.start),
              measureIndex: null
            }); 
          }
          result.push({
            text: "",
            measureIndex: nearestTag.measureIndex
          });
          currentPosition = nearestTag.end;
        }
      }
      return result;
  }





