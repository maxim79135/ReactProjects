import * as React from "react";
import { VisualSettings } from "./settings";
import * as CSS from "csstype";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col } from "reactstrap";

import AdditionalCategory from "./AdditionalCategory";
import AdditionalMeasure from "./AdditionalMeasure";
import MainMeasure from "./MainMeasure";
import MainCategory from "./MainCategory";

export interface State {
  width?: number;
  height?: number;
  margin?: number;
  numberOfCards?: number;
  settings: VisualSettings;
  category: string[];
  main_measure: Number[];
  additionalMeasures: Array<{ name: string; values: Number[] }>;
  additionalCategory: Array<string>;
}

const initialState: State = {
  width: 640,
  height: 480,
  settings: new VisualSettings(),
  category: [],
  main_measure: [],
  additionalMeasures: [],
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

  render() {
    const {
      width,
      height,
      settings,
      category,
      additionalCategory,
      main_measure,
      additionalMeasures,
    } = this.state;

    const cardsPerRow = settings.multipleCardsSettings.cardsPerRow,
      spaceBetweenCards = settings.multipleCardsSettings.spaceBetweenCards;
    // const countRows = Math.floor((category.length - 1) / cardsPerRow) + 1;

    // this.widthCard =
    //   (width - cardsPerRow * spaceBetweenCards - 2 * this.padding) /
    //     cardsPerRow -
    //   2 * this.padding;
    // this.heightCard =
    //   (height - countRows * spaceBetweenCards - 2 * this.padding) / countRows -
    //   this.padding;
    const cards = new Array(category.length).fill(0);
    const isDisabledAdditionalMeasures =
      !settings.measureComparison1.show &&
      !settings.measureComparison2.show &&
      !settings.measureComparison3.show &&
      !settings.categoryAdditionalMeasures.show;

    return (
      <Row xs={cardsPerRow.toString()}>
        {cards.map((v, i) => (
          <Container className="card">
            <Row>
              <MainCategory categoryName={category[i]} settings={settings} />
              <MainMeasure
                value={main_measure[i]}
                settings={settings}
                flag={isDisabledAdditionalMeasures}
              />
              {!isDisabledAdditionalMeasures && (
                <Col xs="6">
                  <AdditionalCategory
                    settings={settings}
                    names={additionalCategory}
                  />
                  <AdditionalMeasure
                    settings={settings}
                    values={additionalMeasures}
                    index={i}
                  />
                </Col>
              )}
            </Row>
          </Container>
        ))}
      </Row>
    );
  }
}

export default Card;
