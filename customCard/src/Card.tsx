import * as React from "react";

export interface State {
  width?: number;
  height?: number;
  margin?: number;
  numberOfCards?: number;
}

const initialState: State = {
  width: 640,
  height: 480,
};

class Card extends React.Component<State> {
  private static updateCallback: (data: object) => void = null;
  state: State = initialState;

  constructor(props) {
    super(props);
    this.state = initialState;
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
    const { width, height, numberOfCards, margin } = this.state;
    const widthCard =
      (width - (numberOfCards + 1) * 2 * margin) / numberOfCards;
    const cards = new Array(numberOfCards).fill(0);

    return (
      <div className="container_card">
        {cards.map((v, i) => (
          <div
            className="card"
            style={{ height: height, width: widthCard, margin: margin }}
          >
            <div className="header">Some text</div>
          </div>
        ))}
      </div>
    );
  }
}

export default Card;
