import * as React from "react";
import { VisualSettings } from "./settings";
import * as CSS from "csstype";
import GridLayout from "react-grid-layout";
import powerbi from "powerbi-visuals-api";

export interface State {
  width?: number;
  height?: number;
  margin?: number;
  numberOfCards?: number;
  settings: VisualSettings;
  category: string[];
  main_measure: Number[];
  measure_comparison_1: Number[];
  measure_comparison_2: Number[];
  additionalCategory: Array<string>;
}

const initialState: State = {
  width: 640,
  height: 480,
  settings: new VisualSettings(),
  category: [],
  main_measure: [],
  measure_comparison_1: [],
  measure_comparison_2: [],
  additionalCategory: [],
};

class Card extends React.Component<State> {
  private static updateCallback: (data: object) => void = null;
  state: State = initialState;
  padding: number = 10;
  widthCard: number;
  heightCard: number;
  styles: {};
  items: Array<{}>;
  layout = [];

  constructor(props) {
    super(props);
    this.state = initialState;
    this.items = new Array(0);
  }

  public static update(newState: State) {
    if (typeof Card.updateCallback == "function") {
      Card.updateCallback(newState);
    }
  }

  public componentWillMount() {
    Card.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    Card.updateCallback = null;
  }

  updateStyles(settings: VisualSettings) {
    const card_style = {
      height: this.heightCard,
      width: this.widthCard,
      backgroundColor: "white",
    };
    const data_label_style = {
      fontSize: settings.mainMeasureSettings.textSize,
      color: settings.mainMeasureSettings.color,
      fontFamily: settings.mainMeasureSettings.fontFamily,
      textAlign: "center" as "center",
      display: "flex" as "flex",
      justifyContent: "center" as "center",
      flexDirection: "column" as "column",
    };

    const category_label_style = {
      textAlign: settings.categoryMainMeasureSettings
        .horizontalAlignment as CSS.Property.TextAlign,
      paddingTop: settings.categoryMainMeasureSettings.paddingTop,
      color: settings.categoryMainMeasureSettings.color,
      fontSize: settings.categoryMainMeasureSettings.textSize,
      fontFamily: settings.categoryMainMeasureSettings.fontFamily,
    };

    const category_additional_measure_style = {
      textAlign: settings.categoryAdditionalMeasures
        .horizontalAlignment as CSS.Property.TextAlign,
      paddingTop: settings.categoryAdditionalMeasures.paddingTop,
      color: settings.categoryAdditionalMeasures.color,
      fontSize: settings.categoryAdditionalMeasures.textSize,
      fontFamily: settings.categoryAdditionalMeasures.fontFamily,
      display: "flex" as "flex",
      justifyContent: "center" as "center",
      flexDirection: "column" as "column",
    };

    return {
      card_style,
      data_label_style,
      category_label_style,
      category_additional_measure_style,
    };
  }

  updateCategoryLabel(index: number) {
    this.items.push({
      i: "header",
      className: "header",
      style: this.styles["category_label_style"],
      value: this.state.category[index],
    });
  }

  updateAdditionalCategoryLabel(index: number) {
    ["header1", "header2", "header3"].map((value, i) =>
      this.items.push({
        i: value,
        className: value,
        style: this.styles["category_additional_measure_style"],
        value: this.state.additionalCategory[i],
      })
    );
  }

  updateMainMeasure(index: number) {
    this.items.push({
      i: "main_measure",
      className: "main_measure",
      style: this.styles["data_label_style"],
      value: this.state.main_measure[index],
    });
  }

  updateMeasureComparison(index: number, values: Number[], id: number) {
    this.items.push({
      i: `measure${id}`,
      className: `measure${id}`,
      style: this.styles["category_additional_measure_style"],
      value: values[index],
    });
  }

  updateElement(index: number) {
    this.items = [];

    this.updateMainMeasure(index);
    if (this.state.settings.categoryMainMeasureSettings.show) {
      this.updateCategoryLabel(index);
    }
    if (this.state.settings.categoryAdditionalMeasures.show) {
      this.updateAdditionalCategoryLabel(index);
    }
    if (this.state.settings.measureComparison1.show) {
      this.updateMeasureComparison(index, this.state.measure_comparison_1, 1);
      this.updateMeasureComparison(index, this.state.measure_comparison_2, 2);
    }
  }

  updateLayout() {
    this.layout = [];
    let offsetY: number = 0;

    if (this.state.settings.categoryMainMeasureSettings.show) {
      this.layout.push({ i: "header", x: 0, y: 0, w: 12, h: 1, static: true });
    } else {
      offsetY -= 1;
    }
    this.layout.push({
      i: "main_measure",
      x: 0,
      y: 1 + offsetY,
      w: 6,
      h: 2 - offsetY,
      static: true,
    });
    if (this.state.settings.categoryAdditionalMeasures.show) {
      this.layout = this.layout.concat([
        { i: "header1", x: 6, y: 1 + offsetY, w: 2, h: 1, static: true },
        { i: "header2", x: 8, y: 1 + offsetY, w: 2, h: 1, static: true },
        { i: "header3", x: 10, y: 1 + offsetY, w: 2, h: 1, static: true },
      ]);
    } else {
      offsetY -= 1;
    }
    if (this.state.settings.measureComparison1.show) {
      this.layout.push({
        i: "measure1",
        x: 6,
        y: 2 + offsetY,
        w: 2,
        h: 1 - offsetY,
        static: true,
      });
      this.layout.push({
        i: "measure2",
        x: 8,
        y: 2 + offsetY,
        w: 2,
        h: 1 - offsetY,
        static: true,
      });
    }
  }

  createElement(el) {
    return (
      <div key={el.i} className={el.className} style={el.style}>
        {el.value}
      </div>
    );
  }

  render() {
    const { width, height, settings, category } = this.state;

    const cardsPerRow = settings.multipleCardsSettings.cardsPerRow,
      spaceBetweenCards = settings.multipleCardsSettings.spaceBetweenCards;
    const countRows = Math.floor((category.length - 1) / cardsPerRow) + 1;

    this.widthCard =
      (width - cardsPerRow * spaceBetweenCards - 2 * this.padding) /
        cardsPerRow -
      2 * this.padding;
    this.heightCard =
      (height - countRows * spaceBetweenCards - 2 * this.padding) / countRows -
      this.padding;
    const cards = new Array(category.length).fill(0);
    this.styles = this.updateStyles(settings);

    return cards.map((v, i) => {
      this.updateLayout();
      this.updateElement(i);

      return (
        <div
          className="container_card"
          style={{
            marginRight: spaceBetweenCards,
            marginBottom: spaceBetweenCards,
          }}
        >
          <div className="card" style={this.styles["card_style"]}>
            <GridLayout
              className="layout"
              layout={this.layout}
              cols={12}
              rowHeight={
                (this.heightCard -
                  settings.categoryMainMeasureSettings.paddingTop -
                  settings.categoryAdditionalMeasures.paddingTop -
                  15) /
                (3)
              }
              width={this.widthCard}
            >
              {this.items.map((el) => this.createElement(el))}
            </GridLayout>
          </div>
        </div>
      );
    });
  }
}

export default Card;
