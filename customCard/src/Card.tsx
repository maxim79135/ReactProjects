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
  additionalCategory: Array<string>;
}

const initialState: State = {
  width: 640,
  height: 480,
  settings: new VisualSettings(),
  category: [],
  main_measure: [],
  measure_comparison_1: [],
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
      // margin: spaceBetweenCards,
      // display: "grid",
      // gridTemplateAreas:
      //   '"header header header header header header header" "main_measure main_measure main_measure main_measure header1 header2 header3" "main_measure main_measure main_measure main_measure measure1 measure2 measure3"',
      backgroundColor: "white",
      // gridGap: 10,
      // padding: this.padding,
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

  updateElement(index: number) {
    this.items.splice(0, this.items.length);
    if (this.state.settings.categoryMainMeasureSettings.show) {
      this.updateCategoryLabel(index);
    }
    if (this.state.settings.categoryAdditionalMeasures.show) {
      this.updateAdditionalCategoryLabel(index);
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
    const {
      width,
      height,
      settings,
      category,
      main_measure,
      measure_comparison_1,
    } = this.state;

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

    const layout = [
      { i: "header", x: 0, y: 0, w: 6, h: 1, static: true },
      { i: "header1", x: 3, y: 1, w: 1, h: 1, static: true },
      { i: "header2", x: 4, y: 1, w: 1, h: 1, static: true },
      { i: "header3", x: 5, y: 1, w: 1, h: 1, static: true },
      { i: "main_measure", x: 0, y: 1, w: 3, h: 2, static: true },
      { i: "measure1", x: 3, y: 2, w: 1, h: 1, static: true },
    ];

    return cards.map((v, i) => {
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
              layout={layout}
              cols={6}
              rowHeight={
                (this.heightCard -
                  settings.categoryMainMeasureSettings.paddingTop -
                  settings.categoryAdditionalMeasures.paddingTop -
                  15) /
                3
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
