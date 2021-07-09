import * as React from "react";

export interface State {
  width: number;
  height: number;
}

const initialState: State = {
  width: 640,
  height: 480,
};

class Card extends React.Component<State> {
  state: State = initialState;

  constructor(props) {
    super(props);
    this.state = initialState;
  }

  private static updateCallback: (data: object) => void = null;

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
    // const {,
    //   } = this.state;

    return <div> Hello world</div>;
  }
}

export default Card;
