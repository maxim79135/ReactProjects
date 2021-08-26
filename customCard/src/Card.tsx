import * as React from "react";
import { VisualSettings } from "./settings";
import * as CSS from "csstype";
import "bootstrap/dist/css/bootstrap.css";
import GridLayout from "react-grid-layout";

import { Container, Row, Col } from "reactstrap";

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
    let styles = this.updateStyles(settings);

    return (
      <Row xs={settings.multipleCardsSettings.cardsPerRow.toString()}>
        {cards.map((v, i) => (
          <Container>
            {settings.categoryMainMeasureSettings.show && (
              <Row style={styles.category_label_style}>{category[i]}</Row>
            )}
            <Row>
              <Col xs="6" style={styles.data_label_style}>
                {main_measure[i]}
              </Col>
              <Col xs="6">
                {settings.categoryAdditionalMeasures.show && (
                  <Row>
                    {settings.measureComparison1.show && (
                      <Col style={styles.category_additional_measure_style}>
                        A
                      </Col>
                    )}
                    <Col>B</Col>
                    <Col>C</Col>
                  </Row>
                )}
                <Row>
                  {settings.measureComparison1.show && (
                    <Col>{measure_comparison_1[i]}</Col>
                  )}
                  <Col>2</Col>
                  <Col>3</Col>
                </Row>
              </Col>
            </Row>
          </Container>
        ))}
      </Row>
    );
  }
}

export default Card;
